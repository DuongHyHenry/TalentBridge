const express = require('express');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const passport = require('passport');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config({ path: 'OAuth.env' });

// Configuration and Setup
const app = express();
const PORT = 5000;

let db;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// SQL Database Connection and Google OAuth
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

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.engine(
    'handlebars',
    expressHandlebars.engine({
        helpers: {
            toLowerCase: function (str) {
                return str.toLowerCase();
            },
            ifCond: function (v1, v2, options) {
                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },
        },
    })
);

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(
    session({
        secret: 'ILoveJeanmarieBwemo',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
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

app.use(express.static('public'));
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
        res.json({ message: 'Logged out from Google' });
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
        res.redirect('/login');
    }
});

app.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
  
app.get('/registerUsername', (req, res) => {
    res.render('registerUsername', { usernameError: req.query.error });
});

app.post('/registerUsername', async (req, res) => {
    try {
        console.log("req.body in /registerUsername:", req.body);
        let username = req.body.username;
        let userFound = await findUserByUsername(username);
        if (userFound) {
            res.redirect('/registerUsername?error=Username%20Already%20Exists');
        } else {
            console.log("Google Id:", req.session.userId);
            let hashedGoogleId = await bcrypt.hash(req.session.userId, 10);
            console.log("Newly Hashed Id:", hashedGoogleId);
            let memberSince = await generateTimeStamp();
            await db.run(
                'INSERT INTO users (username, hashedGoogleId, memberSince) VALUES (?, ?, ?)',
                [username, hashedGoogleId, memberSince]
            );
            res.redirect('http://localhost:5173/');
        }
    } catch (error) {
        console.log("Could not register username:", error);
        res.redirect('http://localhost:5173/Username?error=Error%20registering%20username');
    }
});

async function findUserByHashedId(userId) {
    const query = 'SELECT * FROM users';
    try {
        const rows = await db.all(query);
        userIdString = String(userId);
        for (const row of rows) {
            const isMatch = await bcrypt.compare(userIdString, row.hashedGoogleId);
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
