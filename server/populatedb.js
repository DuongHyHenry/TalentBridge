const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

// Placeholder for the database file name
const databaseFileName = "databaseFile.db";

async function initializeDB() {
  const db = await sqlite.open({
    filename: databaseFileName,
    driver: sqlite3.Database,
  });

  await db.exec(`
        DROP TABLE IF EXISTS solvedProblems;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS problems;
    `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            hashedID TEXT NOT NULL UNIQUE,
            problemsSolved INT NOT NULL,
            memberSince DATETIME NOT NULL
        );
    `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS problems (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            problemID TEXT NOT NULL UNIQUE,
            timesSolved INTEGER NOT NULL,
            difficulty INTEGER NOT NULL
        );
    `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS solvedProblems (
            userID INTEGER NOT NULL,
            problemID INTEGER NOT NULL,
            solvedAt DATETIME NOT NULL,
            PRIMARY KEY (userID, problemID),
            FOREIGN KEY (userID) REFERENCES users(ID),
            FOREIGN KEY (problemID) REFERENCES problems(ID)
        );
    `);

  console.log("Database initialized successfully");
}

initializeDB().catch((err) => {
  console.error("Error initializing database:", err);
});
