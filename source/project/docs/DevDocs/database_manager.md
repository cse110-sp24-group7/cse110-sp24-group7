# Documentation For Database Manager (dbMgr.js)

## Role of Database Manager

The `dbMgr.js` module is responsible for managing the database connection and executing queries in a SQLite database using the `sqlite3` package.
It provides functions to initialize the database, perform CRUD operations on tasks and entries, and handle various queries related to tasks and entries.

## Intended Purpose

The primary purpose of `dbMgr.js` is to serve as an abstraction layer for interacting with the SQLite database.
It ensures that all database operations are performed correctly, providing an interface for the rest of the application to manage tasks, entries, and labels.

## Implementation/Syntax Approaches

The module uses the `sqlite3` package for database interactions and follows a callback-based approach for asynchronous operations. The main functions provided by the module include:

- **Database Connection and Initialization:**
  - `connect`: Connects to the database using a specified path or a default path.
  - `init`: Initializes the database by creating necessary tables.

- **CRUD Operations:**
  - `addTask`, `addTasks`: Add single or multiple tasks to the database.
  - `addEntry`, `addEntries`: Add single or multiple entries to the database.
  - `editTask`: Edit an existing task.
  - `editEntry`: Edit an existing entry.
  - `deleteTask`, `deleteTasks`: Delete single or multiple tasks.
  - `deleteEntry`, `deleteEntries`: Delete single or multiple entries.

- **Query Functions:**
  - `getTasks`, `getTasksConjunctLabels`, `getTasksDisjunctLabels`, `getFilteredTasks`: Retrieve tasks based on various criteria.
  - `getEntries`, `getFilteredEntries`: Retrieve entries based on various criteria.
  - `getLabels`, `getLabelColorMap`: Retrieve labels and their corresponding colors.
  - `fetchTask`: Fetch a specific task by its ID.
  - `fetchEntry`: Fetch a specific entry by its ID.

## Requirements

To use `dbMgr.js`, the following requirements must be met:

- **Node.js and npm:** Ensure that Node.js and npm are installed on the development environment.
- **sqlite3 Package:** The `sqlite3` package must be installed in the project. This is done by running `npm install sqlite3`.
- **Database File:** A SQLite database file should be available at the specified or default path. Touching an empty .db file and then running the `connect` and `init` functions should correctly setup the database for all other functions.

## Testing

To test the functionality of `dbMgr.js`, the following approaches are taken:

1. **Unit Tests:** Unit tests for `dbMgr.js` are located at [/source/project/__tests__/database.test.js](/source/project/__tests__/database.test.js)
2. **Hand Testing:** Manually test the functions by calling them from a application and verifying the results. Ensure that database operations perform correctly under various scenarios.

#### Authors

- Andrew Yang