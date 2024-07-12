const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const passport = require('passport');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config({ path: 'OAuth.env' });

// Configuration and Setup
const app = express();
const PORT = 5000;

let db;

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID_FB = process.env.CLIENT_ID_FB;
const CLIENT_SECRET_FB = process.env.CLIENT_SECRET_FB;

// SQL Database Connection
async function startConnection() {
    try {
        db = await sqlite.open({
            filename: 'databaseFile.db',
            driver: sqlite3.Database
        });
        console.log("Database connected successfully.");
    } catch (err) {
        console.log("Error connecting to the database:", err);
        process.exit(1);
    }
}

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/google/callback`
}, (token, tokenSecret, profile, done) => {
    return done(null, profile);
}));

passport.use(new FacebookStrategy({
    clientID: CLIENT_ID_FB,
    clientSecret: CLIENT_SECRET_FB,
    callbackURL: `http://localhost:${PORT}/auth/facebook/callback`
}, (token, tokenSecret, profile, done) => {
    return done(null, profile);
}));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use(
    session({
        store: new SQLiteStore(),
        secret: 'ILoveJeanmarieBwemo',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
        loggedIn: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.appName = 'Talent Bridge';
    res.locals.copyrightYear = 2024;
    res.locals.postNeoType = 'Posts';
    res.locals.loggedIn = req.session.loggedIn || false;
    res.locals.userId = req.session.userId || '';
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.get('/aboutUs', async (req, res) => {
    res.json({ message: 'About Us content' });
});

app.get('/googleLogout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Logout Error:", err);
            return res.json({ message: 'Error logging out from Google' });
        }
        req.session.destroy();
        res.redirect("http://localhost:5173/")
    });
});

// Define route for Google authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Define callback route after Google authentication
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    try {
        console.log("User Google Id:", req.user.id);
        let userId = req.user.id;
        let userFound = await findUserByHashedId(userId);
        console.log("User Found", userFound);
        if (userFound) {
            req.session.userId = req.user.id;
            req.session.username = userFound.username;
            req.session.email = req.user.email;
            req.session.loggedIn = true;
            res.redirect('http://localhost:5173/');
        } else {
            req.session.userId = userId;
            console.log(req.session.userId);
            req.session.loggedIn = true;
            res.redirect('http://localhost:5173/Username');
        }
    } catch (error) {
        console.log("Could not finish callback:", error);
        res.redirect('/');
    }
});

// Define route for Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));

// Define callback route after Facebook authentication
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), async (req, res) => {
    try {
        console.log("User Facebook Id:", req.user.id);
        let userId = req.user.id;
        let userFound = await findUserByHashedId(userId);
        console.log("User Found", userFound);
        if (userFound) {
            req.session.userId = req.user.id;
            req.session.username = userFound.username;
            req.session.email = req.user.email;
            req.session.loggedIn = true;
            res.redirect('http://localhost:5173/');
        } else {
            req.session.userId = userId;
            console.log(req.session.userId);
            req.session.loggedIn = true;
            res.redirect('http://localhost:5173/Username');
        }
    } catch (error) {
        console.log("Could not finish callback:", error);
        res.redirect('/');
    }
});

app.get('/userInfo', (req, res) => {
    if (req.session.loggedIn) {
        res.json({
            userId: req.session.userId,
            username: req.session.username,
            email: req.session.email
        });
    } else {
        res.status(401).json({ message: 'User not logged in' });
    }
});

app.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.get('/registerUsername', (req, res) => {
    res.redirect('http://localhost:5173/');
});

app.post('/registerUsername', async (req, res) => {
    try {
        let username = req.body.username;
        req.session.username = req.body.username;
        console.log("Username: ", req.session.username);
        let userFound = await findUserByUsername(username);
        if (userFound) {
            res.redirect('http://localhost:5173/');
        } else {
            console.log("User Not Found. Google Id:", req.session.userId);
            let hashedId = await bcrypt.hash(req.session.userId, 10);
            console.log("Newly Hashed Id:", hashedId);
            let memberSince = new Date().toDateString();
            await db.run(
                'INSERT INTO users (username, hashedId, memberSince) VALUES (?, ?, ?)',
                [username, hashedId, memberSince]
            );
            await showDatabaseContents();
            res.redirect('http://localhost:5173/');
        }
    } catch (error) {
        console.log("Could not register username:", error);
        res.redirect('http://localhost:5173/');
    }
});

async function findUserByHashedId(userId) {
    const query = 'SELECT * FROM users';
    try {
        const rows = await db.all(query);
        userIdString = String(userId);
        for (const row of rows) {
            const isMatch = await bcrypt.compare(userIdString, row.hashedId);
            if (isMatch) {
                return row;
            }
        }
        return null;
    } catch (error) {
        console.log('Error executing query:', error);
    }
}

async function findUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
  
    try {
      const row = await db.get(query, [username]);
      if (row) {
        console.log(row);
        return row;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error executing query:', error);
    }
  }
  

async function startConnection() {
    try {
        db = await sqlite.open({ 
            filename: 'databaseFile.db', 
            driver: sqlite3.Database 
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
    const usersTableExists = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='users';`);
    if (usersTableExists) {
        console.log('Users table exists.');
        const users = await db.all('SELECT * FROM users');
        if (users.length > 0) {
            console.log('Users:');
            users.forEach(user => {
                console.log(user);
            });
        } else {
            console.log('No users found.');
        }
    } else {
        console.log('Users table does not exist.');
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
    } catch(error) {
        console.log("Could not generate TimeStamp", error);
    }
    
}