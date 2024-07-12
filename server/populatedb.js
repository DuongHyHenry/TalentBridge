const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

// Placeholder for the database file name
const dbFileName = 'databaseFile.db';

async function initializeDB() {
    const db = await sqlite.open({ filename: dbFileName, driver: sqlite3.Database });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            username TEXT NOT NULL UNIQUE,
            hashedId TEXT NOT NULL UNIQUE,
            memberSince DATETIME NOT NULL
        );
    `);    
}

initializeDB().catch(err => {
    console.error('Error initializing database:', err);
});
