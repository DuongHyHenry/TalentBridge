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
        DROP TABLE IF EXISTS solvedTasks;
        DROP TABLE IF EXISTS taskDescriptions;
        DROP TABLE IF EXISTS tasks;
        DROP TABLE IF EXISTS descriptions;
        DROP TABLE IF EXISTS companies;
        DROP TABLE IF EXISTS users;
    `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            ID INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            hashedID TEXT NOT NULL UNIQUE,
            tasksSolved INT NOT NULL,
            memberSince DATETIME NOT NULL
        );
    `);

  await db.exec(`
      CREATE TABLE IF NOT EXISTS companies (
          ID INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          logo TEXT,
          title TEXT,
          subtitle TEXT,
          tags TEXT,
          URL TEXT
      );
  `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS descriptions (
            ID INTEGER PRIMARY KEY,
            companyID INTEGER,
            company TEXT,
            bulletPoint INTEGER,
            content TEXT,
            section INTEGER,
            FOREIGN KEY (companyID) REFERENCES companies(ID),
            FOREIGN KEY (company) REFERENCES companies(name)
        );
    `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            ID INTEGER PRIMARY KEY,
            companyID INTEGER NOT NULL,
            name TEXT,
            company TEXT NOT NULL,
            title TEXT,
            subtitle TEXT,
            length TEXT,
            FOREIGN KEY (companyID) REFERENCES companies(ID),
            FOREIGN KEY (company) REFERENCES companies(name)
        );
    `);

  await db.exec(`
      CREATE TABLE IF NOT EXISTS taskDescriptions (
          ID INTEGER PRIMARY KEY,
          taskID INTEGER,
          task TEXT,
          bulletPoint INTEGER,
          content TEXT,
          section INTEGER,
          FOREIGN KEY (taskID) REFERENCES tasks(ID),
          FOREIGN KEY (task) REFERENCES tasks(title)
      );
  `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS solvedTasks (
            userID INTEGER NOT NULL,
            taskID INTEGER NOT NULL,
            solvedAt DATETIME NOT NULL,
            PRIMARY KEY (userID, taskID),
            FOREIGN KEY (userID) REFERENCES users(ID),
            FOREIGN KEY (taskID) REFERENCES tasks(ID)
        );
    `);

  // Insert data into the companies table
  const companies = [
    {
      name: "Smartcodes",
      logo: "/src/assets/Smartcodes.png",
      title: "Master the Art of Account Management",
      subtitle: "Elevate your client relations and project management skills with our immersive program.",
      tags: JSON.stringify(["Marketing", "Free", "5000+ 5 Star Reviews"]),
      URL: "Smartcodes",
    },
    {
      name: "Smartnology",
      logo: "/src/assets/Smartnology.png",
      title: "Become a Software Development Expert",
      subtitle: "Dive into the world of coding and software creation with our interactive program.",
      tags: JSON.stringify(["Technology", "Free", "8000+ 5 Star Reviews"]),
      URL: "Smartnology",
    },
    {
      name: "Smartfoundry",
      logo: "/src/assets/Smartfoundry.png",
      title: "Lead the Way in Product Management",
      subtitle: "Master the essentials of product development and strategy in our comprehensive program.",
      tags: JSON.stringify(["Business", "Free", "6000+ 5 Star Reviews"]),
      URL: "Smartfoundry",
    },
    {
      name: "Smartstudio",
      logo: "/src/assets/Smartstudio.png",
      title: "Create Compelling Content",
      subtitle: "Transform your creative ideas into stunning visual content with our immersive program.",
      tags: JSON.stringify(["Media", "Free", "7000+ 5 Star Reviews"]),
      URL: "Smartstudio",
    }
  ];

  await Promise.all(
    companies.map((company) => {
      return db.run(
        "INSERT INTO companies (name, logo, title, subtitle, tags, URL) VALUES (?, ?, ?, ?, ?, ?)",
        [
          company.name,
          company.logo,
          company.title,
          company.subtitle,
          company.tags,
          company.URL
        ]
      );
    })
  );

  // Insert data into the descriptions table
  const descriptions = [
    {
      "ID": 1,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 0,
      "content": "Gain hands-on experience in client interactions and project execution with Smartcodes. Enhance your skills through practical tasks designed to build your confidence in account management.",
      "section": 1
    },
    {
      "ID": 2,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Self-paced 4-5 hours",
      "section": 1
    },
    {
      "ID": 3,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "No grades",
      "section": 1
    },
    {
      "ID": 4,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "No assessments",
      "section": 1
    },
    {
      "ID": 5,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 0,
      "content": "Smartcodes is a leading marketing agency known for delivering exceptional client solutions. Our program allows you to understand the nuances of account management in a dynamic environment. We believe in fostering innovation and collaboration to create impactful marketing strategies. Join us to learn the secrets of successful client engagement and project delivery.",
      "section": 1
    },
    {
      "ID": 6,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Complete the program at your own pace, anywhere.",
      "section": 2
    },
    {
      "ID": 7,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Receive a certificate of completion from Smartcodes to boost your resume.",
      "section": 2
    },
    {
      "ID": 8,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Gain practical experience to set you apart in the job market.",
      "section": 2
    },
    {
      "ID": 9,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Evaluate if Smartcodes is the right fit for you.",
      "section": 2
    },
    {
      "ID": 10,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Complete tasks with guidance from pre-recorded videos and sample answers by our experts.",
      "section": 3
    },
    {
      "ID": 11,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Earn a certificate to showcase your new skills in account management.",
      "section": 3
    },
    {
      "ID": 12,
      "companyID": 1,
      "company": "Smartcodes",
      "bulletPoint": 1,
      "content": "Impress potential employers with your enhanced skills and insights.",
      "section": 3
    },
    {
      "ID": 13,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 0,
      "content": "Experience real-world software development challenges at Smartnology. Enhance your technical skills and boost your confidence through practical coding tasks.",
      "section": 1
    },
    {
      "ID": 14,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "Self-paced 5-6 hours",
      "section": 1
    },
    {
      "ID": 15,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "No grades",
      "section": 1
    },
    {
      "ID": 16,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "No assessments",
      "section": 1
    },
    {
      "ID": 17,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 0,
      "content": "Smartnology specializes in cutting-edge technology solutions, offering web and mobile application development services. This program introduces you to the essentials of software development, empowering you with skills to thrive in a tech-driven world.",
      "section": 1
    },
    {
      "ID": 18,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "A flexible program you can complete at your own pace.",
      "section": 2
    },
    {
      "ID": 19,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "A certificate of completion from Smartnology to add to your portfolio.",
      "section": 2
    },
    {
      "ID": 20,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "Valuable skills to stand out in the tech industry.",
      "section": 2
    },
    {
      "ID": 21,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "Insight into Smartnology’s innovative work environment.",
      "section": 2
    },
    {
      "ID": 22,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "Follow step-by-step tutorials and examples provided by our software experts.",
      "section": 3
    },
    {
      "ID": 23,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "Earn a certificate to demonstrate your proficiency in software development.",
      "section": 3
    },
    {
      "ID": 24,
      "companyID": 2,
      "company": "Smartnology",
      "bulletPoint": 1,
      "content": "Enhance your job applications with newfound technical skills.",
      "section": 3
    },
    {
      "ID": 25,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 0,
      "content": "Gain insight into the product management process at Smartfoundry. Practice essential skills through engaging tasks and prepare yourself for a successful career in product management.",
      "section": 1
    },
    {
      "ID": 26,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "Self-paced 4-5 hours",
      "section": 1
    },
    {
      "ID": 27,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "No grades",
      "section": 1
    },
    {
      "ID": 28,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "No assessments",
      "section": 1
    },
    {
      "ID": 29,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 0,
      "content": "Smartfoundry is a leader in product innovation, focusing on developing and managing successful products. This program gives you a glimpse into the strategic and analytical skills required to excel in product management.",
      "section": 1
    },
    {
      "ID": 30,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "A flexible, self-paced program you can complete anywhere.",
      "section": 2
    },
    {
      "ID": 31,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "A certificate of completion from Smartfoundry to enhance your resume.",
      "section": 2
    },
    {
      "ID": 32,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "Practical experience to help you stand out in the job market.",
      "section": 2
    },
    {
      "ID": 33,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "An inside look at Smartfoundry’s product development approach.",
      "section": 2
    },
    {
      "ID": 34,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "Follow guided tasks with examples and tips from our product management team.",
      "section": 3
    },
    {
      "ID": 35,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "Earn a certificate to showcase your product management expertise.",
      "section": 3
    },
    {
      "ID": 36,
      "companyID": 3,
      "company": "Smartfoundry",
      "bulletPoint": 1,
      "content": "Stand out in interviews with your practical knowledge and skills.",
      "section": 3
    },
    {
      "ID": 37,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 0,
      "content": "Explore the world of content creation at Smartstudio. Practice essential skills and build your portfolio with hands-on tasks designed to enhance your creativity.",
      "section": 1
    },
    {
      "ID": 38,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "Self-paced 3-4 hours",
      "section": 1
    },
    {
      "ID": 39,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "No grades",
      "section": 1
    },
    {
      "ID": 40,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "No assessments",
      "section": 1
    },
    {
      "ID": 41,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 0,
      "content": "Smartstudio is at the forefront of visual content creation, offering photography, videography, and multimedia services. Our program gives you the tools to excel in creative content production.",
      "section": 1
    },
    {
      "ID": 42,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "A self-paced program you can complete on your own time.",
      "section": 2
    },
    {
      "ID": 43,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "A certificate of completion from Smartstudio to showcase your creative skills.",
      "section": 2
    },
    {
      "ID": 44,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "Experience to set you apart in the creative industry.",
      "section": 2
    },
    {
      "ID": 45,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "Insight into Smartstudio’s innovative creative process.",
      "section": 2
    },
    {
      "ID": 46,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "Complete tasks with guidance from pre-recorded tutorials and examples.",
      "section": 3
    },
    {
      "ID": 47,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "Earn a certificate to demonstrate your content creation proficiency.",
      "section": 3
    },
    {
      "ID": 48,
      "companyID": 4,
      "company": "Smartstudio",
      "bulletPoint": 1,
      "content": "Enhance your job applications with impressive creative work.",
      "section": 3
    }
  ];
  

  await Promise.all(
    descriptions.map((description) => {
      return db.run(
        "INSERT INTO descriptions (ID, companyID, company, bulletPoint, content, section) VALUES (?, ?, ?, ?, ?, ?)",
        [
          description.ID,
          description.companyID,
          description.company,
          description.bulletPoint,
          description.content,
          description.section
        ]
      );
    })
  );

  // Insert data into the tasks table
  const tasks = [
    {
      ID: 1,
      name: "Smartcodes1",
      companyID: 1,
      company: "Smartcodes",
      title: "Task One: Client Engagement Strategy",
      subtitle: "Learn how to build effective communication strategies for diverse client portfolios.",
      length: "1-2 hours"
    },
    {
      ID: 2,
      companyID: 1,
      name: "Smartcodes2",
      company: "Smartcodes",
      title: "Task Two: Project Management Essentials",
      subtitle: "Discover the key components of managing projects within tight deadlines.",
      length: "1-2 hours"
    },
    {
      ID: 3,
      companyID: 1,
      name: "Smartcodes3",
      company: "Smartcodes",
      title: "Task Three: Reporting and Analytics",
      subtitle: "Understand how to leverage data to provide insights to clients.",
      length: "1 hour"
    },
    {
      ID: 4,
      companyID: 2,
      name: "Smartnology1",
      company: "Smartnology",
      title: "Task One: Introduction to Coding",
      subtitle: "Learn the basics of programming languages and coding structures.",
      length: "1-2 hours"
    },
    {
      ID: 5,
      companyID: 2,
      name: "Smartnology2",
      company: "Smartnology",
      title: "Task Two: Web Development Fundamentals",
      subtitle: "Explore the essentials of creating responsive websites.",
      length: "1-2 hours",
    },
    {
      ID: 6,
      companyID: 2,
      name: "Smartnology3",
      company: "Smartnology",
      title: "Task Three: Mobile Application Development",
      subtitle: "Understand the process of developing mobile applications.",
      length: "1-2 hours"
    },
    {
      ID: 7,
      companyID: 3,
      name: "Smartfoundry1",
      company: "Smartfoundry",
      title: "Task One: Product Strategy Development",
      subtitle: "Learn how to create and communicate a successful product strategy.",
      length: "1-2 hours"
    },
    {
      ID: 8,
      companyID: 3,
      name: "Smartfoundry2",
      company: "Smartfoundry",
      title: "Task Two: Roadmap Planning",
      subtitle: "Discover how to plan and prioritize product features effectively.",
      length: "1-2 hours"
    },
    {
      ID: 9,
      companyID: 3,
      name: "Smartfoundry3",
      company: "Smartfoundry",
      title: "Task Three: Product Launch Execution",
      subtitle: "Understand the steps involved in launching a new product.",
      length: "1-2 hours"
    },
    {
      ID: 10,
      companyID: 4,
      name: "Smartstudio1",
      company: "Smartstudio",
      title: "Task One: Photography Basics",
      subtitle: "Learn the fundamentals of capturing stunning images.",
      length: "1-2 hours"
    },
    {
      ID: 11,
      companyID: 4,
      name: "Smartstudio2",
      company: "Smartstudio",
      title: "Task Two: Videography Essentials",
      subtitle: "Explore the art of storytelling through video.",
      length: "1-2 hours"
    },
    {
      ID: 12,
      companyID: 4,
      name: "Smartstudio3",
      company: "Smartstudio",
      title: "Task Three: Multimedia Content Creation",
      subtitle: "Discover how to combine various media forms into cohesive content.",
      length: "1 hour"
    }
  ];

  await Promise.all(
    tasks.map((task) => {
      return db.run(
        "INSERT INTO tasks (ID, companyID, name, company, title, subtitle, length) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          task.ID,
          task.companyID,
          task.name,
          task.company,
          task.title,
          task.subtitle,
          task.length
        ]
      );
    })
  );

  console.log("Data has been successfully inserted into the database.");

  const taskDescriptions = [
    // Smartcodes Account Management Virtual Experience Program
    {
      taskID: 1,
      task: "Client Engagement Strategy",
      bulletPoint: 1,
      content: "Developing client-centric solutions",
      section: 1
    },
    {
      taskID: 1,
      task: "Client Engagement Strategy",
      bulletPoint: 1,
      content: "Building long-lasting client relationships",
      section: 1
    },
    {
      taskID: 1,
      task: "Client Engagement Strategy",
      bulletPoint: 0,
      content: "Create a comprehensive client engagement plan for a hypothetical client case.",
      section: 2
    },
    {
      taskID: 2,
      task: "Project Management Essentials",
      bulletPoint: 1,
      content: "Organizing and prioritizing tasks",
      section: 1
    },
    {
      taskID: 2,
      task: "Project Management Essentials",
      bulletPoint: 1,
      content: "Resource allocation",
      section: 1
    },
    {
      taskID: 2,
      task: "Project Management Essentials",
      bulletPoint: 0,
      content: "Develop a project timeline and resource plan for a simulated project.",
      section: 2
    },
    {
      taskID: 3,
      task: "Reporting and Analytics",
      bulletPoint: 1,
      content: "Analyzing performance metrics",
      section: 1
    },
    {
      taskID: 3,
      task: "Reporting and Analytics",
      bulletPoint: 1,
      content: "Crafting client reports",
      section: 1
    },
    {
      taskID: 3,
      task: "Reporting and Analytics",
      bulletPoint: 0,
      content: "Create a report based on simulated client data, showcasing key performance indicators.",
      section: 2
    },

    // Smartnology Software Development Virtual Experience Program
    {
      taskID: 4,
      task: "Introduction to Coding",
      bulletPoint: 1,
      content: "Writing clean, efficient code",
      section: 1
    },
    {
      taskID: 4,
      task: "Introduction to Coding",
      bulletPoint: 1,
      content: "Understanding syntax and logic",
      section: 1
    },
    {
      taskID: 4,
      task: "Introduction to Coding",
      bulletPoint: 0,
      content: "Develop a simple application using the programming language of your choice.",
      section: 2
    },
    {
      taskID: 5,
      task: "Web Development Fundamentals",
      bulletPoint: 1,
      content: "HTML, CSS, and JavaScript basics",
      section: 1
    },
    {
      taskID: 5,
      task: "Web Development Fundamentals",
      bulletPoint: 1,
      content: "Designing user-friendly interfaces",
      section: 1
    },
    {
      taskID: 5,
      task: "Web Development Fundamentals",
      bulletPoint: 0,
      content: "Build a basic web page using HTML, CSS, and JavaScript.",
      section: 2
    },
    {
      taskID: 6,
      task: "Mobile Application Development",
      bulletPoint: 1,
      content: "Mobile app architecture",
      section: 1
    },
    {
      taskID: 6,
      task: "Mobile Application Development",
      bulletPoint: 1,
      content: "Platform-specific development",
      section: 1
    },
    {
      taskID: 6,
      task: "Mobile Application Development",
      bulletPoint: 0,
      content: "Create a prototype of a mobile app for a simulated project.",
      section: 2
    },

    // Smartfoundry Product Management Virtual Experience Program
    {
      taskID: 7,
      task: "Product Strategy Development",
      bulletPoint: 1,
      content: "Identifying market needs",
      section: 1
    },
    {
      taskID: 7,
      task: "Product Strategy Development",
      bulletPoint: 1,
      content: "Defining product vision",
      section: 1
    },
    {
      taskID: 7,
      task: "Product Strategy Development",
      bulletPoint: 0,
      content: "Develop a product strategy for a simulated market scenario.",
      section: 2
    },
    {
      taskID: 8,
      task: "Roadmap Planning",
      bulletPoint: 1,
      content: "Creating a product roadmap",
      section: 1
    },
    {
      taskID: 8,
      task: "Roadmap Planning",
      bulletPoint: 1,
      content: "Aligning features with business goals",
      section: 1
    },
    {
      taskID: 8,
      task: "Roadmap Planning",
      bulletPoint: 0,
      content: "Design a product roadmap for a hypothetical product.",
      section: 2
    },
    {
      taskID: 9,
      task: "Product Launch Execution",
      bulletPoint: 1,
      content: "Managing product launch tasks",
      section: 1
    },
    {
      taskID: 9,
      task: "Product Launch Execution",
      bulletPoint: 1,
      content: "Coordinating cross-functional teams",
      section: 1
    },
    {
      taskID: 9,
      task: "Product Launch Execution",
      bulletPoint: 0,
      content: "Plan and execute a product launch strategy for a fictional product.",
      section: 2
    },

    // Smartstudio Content Creation Virtual Experience Program
    {
      taskID: 10,
      task: "Photography Basics",
      bulletPoint: 1,
      content: "Camera settings and composition",
      section: 1
    },
    {
      taskID: 10,
      task: "Photography Basics",
      bulletPoint: 1,
      content: "Lighting techniques",
      section: 1
    },
    {
      taskID: 10,
      task: "Photography Basics",
      bulletPoint: 0,
      content: "Create a photo series showcasing different photography techniques.",
      section: 2
    },
    {
      taskID: 11,
      task: "Videography Essentials",
      bulletPoint: 1,
      content: "Video editing software",
      section: 1
    },
    {
      taskID: 11,
      task: "Videography Essentials",
      bulletPoint: 1,
      content: "Creating engaging video content",
      section: 1
    },
    {
      taskID: 11,
      task: "Videography Essentials",
      bulletPoint: 0,
      content: "Produce a short video project using editing software.",
      section: 2
    },
    {
      taskID: 12,
      task: "Multimedia Content Creation",
      bulletPoint: 1,
      content: "Integrating visuals and sound",
      section: 1
    },
    {
      taskID: 12,
      task: "Multimedia Content Creation",
      bulletPoint: 1,
      content: "Designing multimedia presentations",
      section: 1
    },
    {
      taskID: 12,
      task: "Multimedia Content Creation",
      bulletPoint: 0,
      content: "Develop a multimedia presentation for a fictional campaign.",
      section: 2
    }
  ];

  await Promise.all(
    taskDescriptions.map((taskDescription) => {
      return db.run(
        "INSERT INTO taskDescriptions (taskID, task, bulletPoint, content, section) VALUES (?, ?, ?, ?, ?)",
        [
          taskDescription.taskID,
          taskDescription.task,
          taskDescription.bulletPoint,
          taskDescription.content,
          taskDescription.section
        ]
      );
    })
  );

  console.log("Database initialized successfully");
}

initializeDB().catch((err) => {
  console.error("Error initializing database:", err);
});
