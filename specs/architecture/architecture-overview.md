# Architecture Overview

This document will provide an insight into the architecture of our project, how we have structured our codebase, and how the different components interact with each other.

## Table of Contents

- [Architecture Overview](#architecture-overview)
  - [Table of Contents](#table-of-contents)
  - [High-Level Overview](#high-level-overview)
  - [Detailed Overview](#detailed-overview)
  - [Frontend](#frontend)
  - [Middleware](#middleware)
    - [Electron](#electron)
    - [SQLite3](#sqlite3)
  - [Backend](#backend)
    - [File System](#file-system)
  - [Conclusion](#conclusion)

## High-Level Overview

Our project is divided into three main components:

1. **Frontend**: Composed of *HTML*, *CSS*, and *JavaScript* files, the frontend is responsible for rendering the user interface and handling user interactions. We use Shadow DOM and web components to modularize our code and make it more maintainable. 
2. **Middleware**: Written using both *SQL* and *Javascript*, the middleware exposes backend functionality to the frontend. Using *Electron* we can expose custom APIs in the form of SQL Routes or queries to the filesystem to the frontend, which protects/compartments the backend from the frontend.
3. **Backend**: The backend is responsible for handling the logic and retrieval of data. It is written in *SQL* and is responsible for managing the database and executing queries. The backend is exposed to the middleware through SQL queries and routes. This enables a more complex and secure backend that is not directly exposed to the frontend and modifiable. 


## Detailed Overview

## Frontend

Composed of strictly HTML, CSS and Javascript, our frontend is launched/initalized upon Electron successfully starting up. The frontend is responsible for rendering the user interface and handling user interactions. 

We modularize our code using Shadow DOM and web components. Our Task and Journal entires are web component popups that are populated with data from the backend. We lended to use **client-side rendering** as it is slightly more efficient than server side rendering for our PWA. We wanted our backend to be as minimal as possible and to only handle the data and not the rendering of the data(similar to MVC architecture).

Our site is then decomposed into 3 views: 
1. **Calendar View**: This view is responsible for rendering the calendar and the tasks that are associated with each day. Although the calendar itself is treated as a webcomponent, this is mainly for folder organization and not for rendering purposes. The tasks are rendered as web components and are populated with data from the backend(via a SQL route that grabs all the entries). Updates to the task are done via a SQL route(upon confirmation of the user creating/deleting/editing a task). This triggers a **callback** or a re-render of the task list as the SQL route updates the backend Databse. 
2. **All Tasks View**: This view is responsible for rendering all the tasks that are associated with the user. Similar to the calendar view, this view does not allow for modification/IO of the tasks. The CRUD interface is locked to the Calendar View, and the All Tasks View is mainly for viewing purposes. This view gives functionality to the user to filter tasks by label, and to search for tasks as well as showcase the percentage of time left for each task. Since both the calendar view and the all tasks view rely on entries from the backend, we have more **callbacks** that are triggered when the filters are updated. We parse an array of Filters/Labels and then update the tasks that are displayed on the screen. 
3. **The Vault**: This view is responsible for rendering the files that are associated with the user. The files are stored in the `UserData` folder and are accessed via the electrons `fs` module. We have a `fileMgr.js` file that abstracts these details and allows for the frontend to access the files. Depending on the extension of the file, we render the file and use the `fs` module to open the file should the user want to view it(motivating our code-snippet/screenshot storage system.)

## Middleware
There are two main components of the middleware: **Electron** and **SQLite3**. 

### Electron

While used to package the app as a PWA, electron also allows us to *interface* with a user's own file system. This is useful for the Vault feature, where we can access the user's files and display them in the app. We create API endpoints in the form of *SQL Routes* that allow the frontend to interact with the backend. 

There are two main processes that are spawned by Electron: **Main** and **Renderer**. The **Main** process is responsible for creating the BrowserWindow and the **Renderer** process is responsible for rendering the HTML, CSS and Javascript. The **Main** process is also responsible for creating the SQL routes and the **Renderer** process is responsible for calling the SQL routes. We ensure that all dependencies are loaded in(i.e. the Database) prior to the SQL routes being called. Once we have set up the app and have confirmed access to the `filesystem` and have confirmed access to the UserData folder, the renderer process works to build out the rest of the app, ensuring that we do not have/engage with unexpected behavior. 

### SQLite3

The motivating factor behind using SQLite3 was that it was a **lightweight** and **easy to use** database that was compatible with Electron. We have a `dbMgr.js` file that abstracts the details of the database and allows for the middleware to interact with the database. `dbMgr.js` also houses all of our SQL routes that are called by the frontend similar to system calls, the frontend can pass in a filter or make a request to the backend to get all the entries. The backend then returns the entries and the frontend renders them and then runs a callback to update the view.

We needed **persistent** as well as **advanced querying** to filter tasks by label and to search for tasks, and we also wanted this storage to last even after the app was closed. SQLite3 was the perfect choice for this as in contrast to `LocalStorage` or `SessionStorage`, SQLite3 is a **persistent** storage that is not cleared upon closing the app, and allowed us to make many Quality of Life improvements in querying/user access. 

## Backend

Our backend just creates the tables within our Database and is responsible for handling queries. Not only does `dbMgr.js` house all of our SQL routes, but it also initializes the tables needed for the app to run, like the creation of the `Entries` Table and the `Labels` table(which functions like a map of label to color). 

While there could be vulnerability in the SQL routes, we have taken steps to ensure that the SQL routes are not directly exposed to the frontend. The SQL routes are called by the middleware and the middleware then returns the data to the frontend. This ensures that the backend is not directly exposed to the frontend and that the frontend cannot modify the backend, only the routes that are exposed to the frontend can be called(a protection set in place by Electron). 


### File System

Using Electron's `fs` module, we can access the user's file system and store files in the `UserData` folder. This allows us to open up files in the Vault feature and display them, as well as store code snippets, filter images and text files, and parse through them. 

## Conclusion

Our project is structured in a way that allows for a clear separation of concerns between the frontend, middleware, and backend. This makes our codebase more maintainable and easier to work with. We have also taken steps to ensure that the backend is secure and not directly exposed to the frontend.