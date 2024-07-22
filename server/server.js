const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const passport = require("passport");
const bcrypt = require("bcrypt");
const path = require("path");
const cors = require("cors");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config({ path: "OAuth.env" });

// Configuration and Setup
const app = express();
const PORT = 5000;

let db;

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID_FB = process.env.CLIENT_ID_FB;
const CLIENT_SECRET_FB = process.env.CLIENT_SECRET_FB;

// SQL Database Connection
async function startConnection() {
  try {
    db = await sqlite.open({
      filename: "databaseFile.db",
      driver: sqlite3.Database,
    });
    console.log("Database connected successfully.");
  } catch (err) {
    console.log("Error connecting to the database:", err);
    process.exit(1);
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    (token, tokenSecret, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: CLIENT_ID_FB,
      clientSecret: CLIENT_SECRET_FB,
      callbackURL: `http://localhost:${PORT}/auth/facebook/callback`,
    },
    (token, tokenSecret, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(
  session({
    store: new SQLiteStore(),
    secret: "ILoveJeanmarieBwemo",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    loggedIn: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.appName = "Talent Bridge";
  res.locals.copyrightYear = 2024;
  res.locals.postNeoType = "Posts";
  res.locals.loggedIn = req.session.loggedIn || false;
  res.locals.userID = req.session.userID || "";
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.get("/aboutUs", async (req, res) => {
  res.json({ message: "About Us content" });
});

app.get("/googleLogout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Logout Error:", err);
      return res.json({ message: "Error logging out from Google" });
    }
    req.session.destroy();
    res.redirect("http://localhost:5173/");
  });
});

// Define route for Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Define callback route after Google authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      console.log("User Google ID:", req.user.ID);
      let userID = req.user.ID;
      let userFound = await findUserByHashedID(userID);
      console.log("User Found", userFound);
      if (userFound) {
        req.session.userID = req.user.ID;
        req.session.username = userFound.username;
        req.session.email = req.user.email;
        req.session.loggedIn = true;
        res.redirect("http://localhost:5173/");
      } else {
        req.session.userID = userID;
        console.log(req.session.userID);
        req.session.loggedIn = true;
        res.redirect("http://localhost:5173/Username");
      }
    } catch (error) {
      console.log("Could not finish callback:", error);
      res.redirect("/");
    }
  }
);

// Define route for Facebook authentication
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile"] })
);

// Define callback route after Facebook authentication
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      console.log("User Facebook ID:", req.user.ID);
      let userID = req.user.ID;
      let userFound = await findUserByHashedID(userID);
      console.log("User Found", userFound);
      if (userFound) {
        req.session.userID = req.user.ID;
        req.session.username = userFound.username;
        req.session.email = req.user.email;
        req.session.loggedIn = true;
        res.redirect("http://localhost:5173/");
      } else {
        req.session.userID = userID;
        console.log(req.session.userID);
        req.session.loggedIn = true;
        res.redirect("http://localhost:5173/Username");
      }
    } catch (error) {
      console.log("Could not finish callback:", error);
      res.redirect("/");
    }
  }
);

app.get("/userInfo", (req, res) => {
  if (req.session.loggedIn) {
    res.json({
      userID: req.session.userID,
      username: req.session.username,
      email: req.session.email,
    });
  } else {
    res.status(401).json({ message: "User not logged in" });
  }
});

app.get("/api/example", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.get("/registerUsername", (req, res) => {
  res.redirect("http://localhost:5173/");
});

app.post("/registerUsername", async (req, res) => {
  try {
    let username = req.body.username;
    req.session.username = req.body.username;
    console.log("Username: ", req.session.username);
    let userFound = await findUserByUsername(username);
    if (userFound) {
      res.redirect("http://localhost:5173/");
    } else {
      console.log("User Not Found. Google ID:", req.session.userID);
      let hashedID = await bcrypt.hash(req.session.userID, 10);
      console.log("Newly Hashed ID:", hashedID);
      let memberSince = new Date().toDateString();
      await db.run(
        "INSERT INTO users (username, hashedID, problemsSolved, memberSince) VALUES (?, ?, ?, ?)",
        [username, hashedID, 0, memberSince]
      );
      await showDatabaseContents();
      res.redirect("http://localhost:5173/");
    }
  } catch (error) {
    console.log("Could not register username:", error);
    res.redirect("http://localhost:5173/");
  }
});

async function displayProblems(problemIDs) {
  try {
    let currentProblem = 0;
    let finalProblems = [];

    while (problemIDs.length > currentProblem) {
      let problemRow = await db.get(`SELECT * FROM problems WHERE ID = ?`, [
        problemIDs[currentProblem],
      ]);
      if (problemRow) {
        finalProblems.push(problemRow);
      }
      currentProblem++;
    }
    console.log(finalProblems);
  } catch (error) {
    console.log("Could not display problems:", error);
  }
}

async function addProblem() {}

async function problemSolved(userID, problemID) {
  try {
    let solvedAt = new Date().toDateString();
    await db.run(
      "INSERT INTO solvedProblems (userID, problemID, solvedAt) VALUES (?, ?, ?)",
      [userID, problemID, solvedAt]
    );
    await db.run(
      "UPDATE users SET problemsSolved = problemsSolved + 1 WHERE id = ?",
      [userID]
    );
    await db.run(
      "UPDATE problems SET timesSolved = timesSolved + 1 WHERE id = ?",
      [problemID]
    );
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

async function findUserByHashedID(userID) {
  const query = "SELECT * FROM users";
  try {
    const rows = await db.all(query);
    userIDString = String(userID);
    for (const row of rows) {
      const isMatch = await bcrypt.compare(userIDString, row.hashedID);
      if (isMatch) {
        return row;
      }
    }
    return null;
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

async function findUserByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ?";

  try {
    const row = await db.get(query, [username]);
    if (row) {
      console.log(row);
      return row;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

async function findProblemByID(problemID) {
  const query = "SELECT * FROM problems WHERE problemID = ?";

  try {
    const row = await db.get(query, [problemID]);
    if (row) {
      console.log(row);
      return row;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

async function findProblemByCompany(company) {
  const query = "SELECT * FROM problems WHERE company = ?";

  try {
    const companyProblems = await db.get(query, [company]);
    if (companyProblems) {
      console.log(companyProblems);
      return companyProblems;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

async function findProblemByDifficulty(difficulty) {
  const query = "SELECT * FROM problems WHERE difficulty = ?";

  try {
    const difficultyProblems = await db.get(query, [difficulty]);
    if (difficultyProblems) {
      console.log(difficultyProblems);
      return difficultyProblems;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

async function startConnection() {
  try {
    db = await sqlite.open({
      filename: "databaseFile.db",
      driver: sqlite3.Database,
    });
    console.log("Database connected successfully.");
  } catch (err) {
    console.log("Error connecting to the database:", err);
    process.exit(1);
  }
}

startConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

async function showDatabaseContents() {
  // Check if the users table exists
  const usersTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='users';`
  );
  if (usersTableExists) {
    console.log("Users table exists.");
    const users = await db.all("SELECT * FROM users");
    if (users.length > 0) {
      console.log("Users:");
      users.forEach((user) => {
        console.log(user);
      });
    } else {
      console.log("No users found.");
    }
  } else {
    console.log("Users table does not exist.");
  }

  const problemsTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='problems';`
  );
  if (problemsTableExists) {
    console.log("Problems table exists.");
    const problems = await db.all("SELECT * FROM problems");
    if (problems.length > 0) {
      console.log("Problems:");
      problems.forEach((problem) => {
        console.log(problem);
      });
    } else {
      console.log("No problems found.");
    }
  } else {
    console.log("Problems table does not exist.");
  }

  const problemsSolvedTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='problemsSolved';`
  );
  if (problemsSolvedTableExists) {
    console.log("Problems table exists.");
    const problemsSolved = await db.all("SELECT * FROM problemsSolved");
    if (problemsSolved.length > 0) {
      console.log("Problems:");
      problemsSolved.forEach((problemSolved) => {
        console.log(problemSolved);
      });
    } else {
      console.log("No problems solved.");
    }
  } else {
    console.log("Problems solved table does not exist.");
  }
}

async function generateTimeStamp() {
  try {
    const currentTime = new Date();
    const year = twoDigits(currentTime.getFullYear());
    const month = twoDigits(currentTime.getMonth());
    const day = twoDigits(currentTime.getDate());
    const hours = twoDigits(currentTime.getHours());
    const minutes = twoDigits(currentTime.getMinutes());
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`;
    return timestamp;
  } catch (error) {
    console.log("Could not generate TimeStamp", error);
  }
}
