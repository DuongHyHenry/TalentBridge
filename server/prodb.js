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

  const descTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='descriptions';`
  );
  if (descTableExists) {
    const desc = await db.all("SELECT * FROM descriptions");
    if (desc.length > 0) {
      console.log("Descriptions:");
      desc.forEach((desc) => {
        console.log(desc);
      });
    } else {
      console.log("No descriptions.");
    }
  } else {
    console.log("Descriptions table does not exist.");
  }
  const tasksTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='tasks';`
  );
  if (tasksTableExists) {
    console.log("Tasks table exists.");
    const tasks = await db.all("SELECT * FROM tasks");
    if (tasks.length > 0) {
      console.log("Tasks:");
      tasks.forEach((task) => {
        console.log(task);
      });
    } else {
      console.log("No tasks found.");
    }
  } else {
    console.log("Tasks table does not exist.");
  }

  const taskDescTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='taskDescriptions';`
  );
  if (taskDescTableExists) {
    console.log("Task description table exists.")
  }

  const tasksSolvedTableExists = await db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='solvedTasks';`
  );
  if (tasksSolvedTableExists) {
    console.log("Solved tasks table exists.");
    const tasksSolved = await db.all("SELECT * FROM solvedTasks");
    if (tasksSolved.length > 0) {
      console.log("Solved tasks:");
      tasksSolved.forEach((taskSolved) => {
        console.log(taskSolved);
      });
    } else {
      console.log("No tasks solved.");
    }
  } else {
    console.log("Solved tasks table does not exist.");
  }
  
  await db.close();
}

showDatabaseContents().catch(err => {
    console.error('Error showing database contents:', err);
});
