const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

// Placeholder for the database file name
const dbFileName = "databaseFile.db";

// Function to test if database is correct by printing it out
async function showDatabaseContents() {
  const db = await sqlite.open({
    filename: dbFileName,
    driver: sqlite3.Database,
  });

  console.log('Opening database file:', dbFileName);


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
  await db.close();
}

showDatabaseContents().catch(err => {
    console.error('Error showing database contents:', err);
});