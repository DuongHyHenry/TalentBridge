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
    origin: "http://localhost:5173",
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

// Route for Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after Google authentication
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

// Route for Facebook authentication
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile"] })
);

// Callback route after Facebook authentication
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

// Route to get user's info
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

// Route to redirect to homepage after registering username
app.get("/registerUsername", (req, res) => {
  res.redirect("http://localhost:5173/");
});

// Route to choose username after registering
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
        "INSERT INTO users (username, hashedID, tasksSolved, memberSince) VALUES (?, ?, ?, ?)",
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

app.get("/companies", async (req, res) => {
  try {
    const companies = await getCompanies();
    res.json(companies);
  } catch (error) {
    console.log("Failed to return companies: ", error);
  }
});

app.get("/companies/:companyName", async (req, res) => {
  const { companyName } = req.params;

  try {
    // Fetch company data
    const company = await getCompanyByName(companyName);

    if (!company) {
      return res.status(404).send("Company not found");
    }

    // Fetch descriptions based on the company ID
    const descriptions = await getCompanyDescription(company.name);

    const tasks = await getTasksByCompany(company.name);

    // Combine company data with descriptions
    const companyData = {
      ID: company.ID,
      name: company.name,
      logo: company.logo,
      title: company.title,
      subtitle: company.subtitle,
      tags: company.tags,
      URL: company.URL,
      descriptions,
      tasks
    };

    console.log(companyData);

    res.json(companyData);
  } catch (error) {
    console.error("Error fetching company data and descriptions:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/tasks/:taskName", async (req, res) => {
  const { taskName } = req.params;

  try {
    // Fetch company data
    const task = await getTaskByName(taskName);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    const descriptions = await getDescByTask(task.ID);

    // Combine company data with descriptions
    const taskData = {
      ID: task.ID,
      companyID: task.companyID,
      name: task.name,
      company: task.company,
      title: task.title,
      subtitle: task.subtitle,
      length: task.length,
      descriptions
    };

    console.log("Task:", taskData);

    res.json(taskData);
  } catch (error) {
    console.error("Error fetching task data and descriptions:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function getCompanies() {
  try {
    const companies = await db.all("SELECT * FROM companies");
    return companies;
  } catch (error) {
    console.log("Failed to fetch companies: ", error);
  }
}

async function getCompanyByName(name) {
  try {
    const company = await db.get(
      "SELECT * FROM companies WHERE name = ?",
      name
    );
    return company;
  } catch (error) {
    console.log("Failed to fetch company by name: ", error);
  }
}

async function getCompanyDescription(name) {
  try {
    const description = await db.all(
      "SELECT * FROM descriptions WHERE company = ? ORDER BY ID",
      name
    );
    return description;
  } catch (error) {
    console.log("Failed to fetch company description by name: ", error);
  }
}

async function getTasksByCompany(name) {
  try {
    const tasks = await db.all(
      "SELECT * FROM tasks WHERE company = ? ORDER BY ID ASC",
      name
    );
    return tasks;
  } catch (error) {
    console.log("Failed to fetch company tasks by name: ", error);
  }
}

async function getTaskByName(name) {
  try {
    const task = await db.get(
      "SELECT * FROM tasks WHERE name = ?",
      name
    );
    return task;
  } catch (error) {
    console.log("Failed to fetch task by name: ", error);
  }
}

async function getCompanyByTask(name) {
  try {
    const task = await db.get(
      "SELECT company FROM tasks WHERE name = ?",
      name
    );
    return task;
  } catch (error) {
    console.log("Failed to fetch company by name: ", error);
  }
}

async function getDescByTask(ID) {
  try {
    const taskDescriptions = await db.all(
      "SELECT * FROM taskDescriptions WHERE taskID = ? ORDER BY ID ASC",
      ID
    );
    console.log("Task Descriptions: ", taskDescriptions);
    return taskDescriptions;
  } catch (error) {
    console.log("Failed to fetch task descriptions by task: ", error);
  }
}

// Function to display tasks from company
async function displayTasks(taskIDs) {
  try {
    let currenttask = 0;
    let finaltasks = [];

    while (taskIDs.length > currenttask) {
      let taskRow = await db.get(`SELECT * FROM tasks WHERE ID = ?`, [
        taskIDs[currenttask],
      ]);
      if (taskRow) {
        finaltasks.push(taskRow);
      }
      currenttask++;
    }
    console.log(finaltasks);
  } catch (error) {
    console.log("Could not display tasks:", error);
  }
}

// Function to help company add tasks of their own to the website
async function addtask() {}

// Function that tracks that a task is solved by the user
async function taskSolved(userID, taskID) {
  try {
    let solvedAt = new Date().toDateString();
    await db.run(
      "INSERT INTO solvedtasks (userID, taskID, solvedAt) VALUES (?, ?, ?)",
      [userID, taskID, solvedAt]
    );
    await db.run(
      "UPDATE users SET tasksSolved = tasksSolved + 1 WHERE id = ?",
      [userID]
    );
    await db.run(
      "UPDATE tasks SET timesSolved = timesSolved + 1 WHERE id = ?",
      [taskID]
    );
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

// Function that finds a user by their hashed ID
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

// Function that finds a user by their username
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

// Funtion that finds a task by its ID
async function findtaskByID(taskID) {
  const query = "SELECT * FROM tasks WHERE taskID = ?";

  try {
    const row = await db.get(query, [taskID]);
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

// Function that finds all tasks by a company
async function findtaskByCompany(company) {
  const query = "SELECT * FROM tasks WHERE company = ?";

  try {
    const companytasks = await db.get(query, [company]);
    if (companytasks) {
      console.log(companytasks);
      return companytasks;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

// Function that finds tasks by difficulty
async function findtaskByDifficulty(difficulty) {
  const query = "SELECT * FROM tasks WHERE difficulty = ?";

  try {
    const difficultytasks = await db.get(query, [difficulty]);
    if (difficultytasks) {
      console.log(difficultytasks);
      return difficultytasks;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error executing query:", error);
  }
}

// Function that connects to the SQLite databse
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

// Listens for connection then informs the user in console log
startConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// Function to test if database is correct by printing it out
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

  const companiesTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='companies';`
  );
  if (companiesTableExists) {
    console.log("Companies table exists.");
    const companies = await db.all("SELECT * FROM companies");
    if (companies.length > 0) {
      console.log("Companies:");
      companies.forEach((company) => {
        console.log(company);
      });
    } else {
      console.log("No companies found.");
    }
  } else {
    console.log("Companies table does not exist.");
  }

  const tasksTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='tasks';`
  );
  if (tasksTableExists) {
    console.log("tasks table exists.");
    const tasks = await db.all("SELECT * FROM tasks");
    if (tasks.length > 0) {
      console.log("tasks:");
      tasks.forEach((task) => {
        console.log(task);
      });
    } else {
      console.log("No tasks found.");
    }
  } else {
    console.log("tasks table does not exist.");
  }

  const tasksSolvedTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='tasksSolved';`
  );
  if (tasksSolvedTableExists) {
    console.log("tasks table exists.");
    const tasksSolved = await db.all("SELECT * FROM tasksSolved");
    if (tasksSolved.length > 0) {
      console.log("tasks:");
      tasksSolved.forEach((taskSolved) => {
        console.log(taskSolved);
      });
    } else {
      console.log("No tasks solved.");
    }
  } else {
    console.log("tasks solved table does not exist.");
  }
}
