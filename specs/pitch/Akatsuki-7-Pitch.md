# Akatsuki 7 Pitch

### Authors:

- Samvrit, Arnav, Angie, Mialyssa, Emma, Naina, Andrew, Matteo, Hashim, Deena, Jessica

## Problem:

| Cases                              | Description                                                                                                                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New Developer                      | You’re a new developer, just getting onboarded. You’re given a lot of files related to the project and have no idea how to get started or to find the information you need.                                       |
| Iron Triangle                      | You are following the iron triangle like a good CSE 110 student and want to balance between time, cost, and quality. You want to determine a reasonable timeline for completing the project with optimal quality. |
| Large Codebases/Project Management | You’re a developer working on a large project. The division of labor is unclear and there is a lack of communication on what’s being completed.                                                                   |

### High Level Themes

| Problem Themes                                 | Potential Features                                                                             |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Retention and Organization of Work Information | • Search and Filter of items <br> • File Storage                                               |
| Time Management                                | • Timeline <br> • Task Management <br> • Notifications <br> • Calendar <br> • Dated Todo Items |
| Organizing Workflow                            | • Calendar <br> • Reminders                                                                    |
| Divison of Labor                               | • Task Management <br> • Kanban Board <br> • Diagramming                                       |

### Problem Analysis

The problems presented here warrant the usage of a _centralized_ platform that enables a **given user** to organize and manage their work. As Students of CSE 110, having to use many different tools and integrations to manage our work is a common problem. With our End Users being **Developers**, we see the need for a platform that bridges the gap between the diferent tools we use. Developers appear to want a platform that can help them diagram, store files and pertinent information, and manage their time.

## Appetite

### Time

- Allotted Budget: **5 weeks**

Given that we only have 5 weeks to complete this project, we need to be mindful of the possible features that we intend to implement. We want to create a psychologically safe environment for our developers to work in, and we want to ensure that we are able to deliver a product that is both functional and usable. This warrants that we attempt to keep our scope as narrow as possible, and once we have a Minimum Viable Product, we can then expand upon it.(Progressive Enhancement in terms of AGILE).

Currently we meet **2 Days a Week** with a Mid-Week Sync and a Weekly Standup to get the team on the same page. This provides us with the resources to schedule 2 week sprints.

#### Decision for Sprint Timeline

We decided to come up with a 2 week iteration timeline because it allows us to have a good balance between time and quality. If we aimed to have 1 week iteration, we would have to rush the development process and the quality of the end product would be compromised. A variety of features would not be delivered in time, and many issues would be backlogged. On the other hand, if we aimed to have 3+ week iterations, we would only complete a few features every 3 weeks, and that leaves no time for feedback and iteration 2(as we only have 5 weeks).

With **2 Weeks**, at Akatsuki 7 we aim to find the balance between time and quality. With 2 week iterations, the first iteration will be developing a Minimum Viable Product above all else, something that is _usable_ and _deployable_ by our End Users. Following that we can explore on our rabbit holes and possible V2 features that can be implemented in the remaining time. The last week will serve as _catch-up_ and _polishing_ week prior to the final submission of the project.

### Cost

- Allotted Budget: **$0**

This project is meant to be free of cost and to serve as a learning experience for the team leads and the Developers/Designers. We will attempt to do our best at taking a "local-first" approach as we realize the complexity that occurs with using external APIs and services like MongoDB,AWS, and Google BigQuery/Cloud. By using a local-first approach, we can ensure that our project is not only secure, but also that we are able to deliver a product that is only reliant on the _user_ and the _local machine_ that they are using to run the application, _asynchronoous_ and _independent_ of our team.

### Scope

Based on our established time constraints, we have decided to focus on the following features for MVP:

- Weekly Task View
- Create/Modify/Delete Tasks + Journals
- Upload and view Files in the Vault (machine storage, local filesystem)
- Basic Routing

This basic functionality encompasses our goal for the project, enabling users to manage their tasks and files in a single platform that is easy to use and navigate. By taking a minimalistic approach, we can ensure that we are able to deliver a product that is responsive, functional, and is modular with relation to future iterations and features we want to add.

#### V2 and Onwards

While we will address this in our **risks and rabbit holes**, we have a few features that we would like to implement in the future. These include:

- Togglable view of tasks(between weekly, monthly, and daily)
- Kanban Board
- Multi-Project Views
- Support Recurring Tasks
- Mobile-Website Support
- Packaging and Deployment
- User Authentification and personalized views
- Statistics and Analytics regarding tasks
- Sentiment Integration for Journals
- Dependency Graphs for Tasks

Not all of these features will be implemented and we understand that, as we attempt our first iteration, the team leads will reassess the scope and level of features we aim to include in our web application.

## Solution

### Overview - Statement of Purpose

Our software aims to **streamline** and **enhance** the productivity of software developers by providing a comprehensive platform for task management, journaling, and code snippet storage, fostering efficient workflow and effective documentation of their work processes.

### Miro Board and Consolidation

Please take a look at our Miro Board: [Miro Board](../brainstorm/Website%20Flowchart.pdf) that has links to our references(Todoist, Google Calendar, Trello, Notion) and our design process from Fat Marker Sketches to Wireframes.

### User Personas

Some possible users of our software include:

| User            | Attributes                                                                                                              | Desires                                                                                                                    | Pain Points                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| New Developer   | - New to the team <br> - Inexperienced with the project <br> - Struggling to find information                           | - Easy access to information <br> - Clear organization of tasks                                                            | - Overwhelmed by the amount of information <br> - Difficulty in finding information |
| Freelancer      | - Works on multiple projects <br> - Needs to manage time effectively                                                    | - Efficient task management <br> - Clear organization of tasks                                                             | - Difficulty in managing multiple projects <br> - Difficulty in managing time       |
| CSE 110 Student | - Works on multiple classes <br> - Keeps track of Professor-sourced information <br> - Needs to manage time effectively | - Efficient task management <br> - Clear organization of tasks <br> - Local, easy to find place to store notes and tidbits | - Difficulty in managing multiple classes                                           |

From our user personas, we can derive not only **User Stories** but also Developer Stories that can help us understand the needs and desires of our users:

- As a user, I want to be able to search for a task in my list.
- As a user, I want to be able to export selected tasks to share with others.
- As a user, I want to set reminders on entries so that I can be alerted to do something at a specific time
- As a user, I want to have easy access to all of my upcoming due dates in one place.
- As a user, I want to be able to toggle between different views to see my tasks
- As a user I want to have the ability to track the amount of time spent on a given task

- As a developer, I want to be able to easily write pseudocode in a journal
- As a developer, I want to implement both a light and dark mode.
- As a developer, I want to create a modular architecture so that the app can easily be expanded with additional features in the future without major changes.
- As a developer, I need to ensure that the app is usable by people with disabilities.

## Risks and Rabbit Holes

The Vault itself is a risky and tricky concept to implement. Usually we lended to using the cloud but in an effort to make sure we have as little dependencies as possible, we've down-sized the scope of the Vault to create and access/modify a folder that is created on the user's own machine. Either through the Filesystem API or through a local server, we will be able to store files and access them through the application. We will also segment the types of files stored to only _images_ and _texts_ to ensure that we are able to handle the files properly.

Another risk is the implementation of the Dependency Graphs for Tasks. This is a feature that we would like to implement in the future, but it is a risky feature to implement as it requires a lot of backend work to ensure that the tasks are properly linked and that the graph is properly rendered. We are saving this feature for our second iteration so that we can focus on the core features of the application. If the feature proves to be too difficult to implement, we will consider removing it from the scope of the project and the product can still be functional without it.

Likewise, implementing a Kanban Board is another feature that may take a long time to implement. We will be using the Kanban Board as a way to visualize the tasks that the user has to complete, but it is a feature that we will save for the second, if not the last iteration of the project. The app can still be shipped without the Kanban Board, but it is a feature that would accent the application and make it more user-friendly.

Markdown Editor, this is an **addressed** risk that we have decided to tackle head-on. We have decided that we will wrap the markdown editor in a component that will allow us to embed this external library into our application. Making a markdown editor from scratch is a risky and time-consuming process, so we have decided to use an external library to help us with this feature. Either SimpleMDE or QuillJS will be used to implement the markdown editor as the time spent on this feature will be minimal and the benefits with it being a wrapper will be more beneficial than creating a markdown editor from scratch.

## Packaging + Deployment

We will be using a local-first approach, however going about it will be difficult due to the lack of synchronization between different devices. Without going to the cloud, we aim to create a **desktop app** using ElectronJS to package our website into a desktop application. This will allow us to bypass the need to use the FileSystem API and just use the local storage of the user's machine. This will also allow us to create a more secure application as we will not be storing any data on the cloud. We can also extend using ElectronJS to create a mobile application, but this will be a stretch goal and will be saved for the last iteration of the project.

We understand that using Electron is a risk, as this is a completely new technology that we have not used before. We will be sure to document our entire process as we explore this feature, but note that if ElectronJS does not pan out, the core architecture of our application can still be deployed and used as a web application, using browser cookies and caches to store the user's data.

## Limitations

Some features we aim to avoid
| Feature | Breakdown |
| --- | --- |
| Year view | Makes the tasks too small to see and interact with <br> Not much benefit for a user <br> Clutters the Page |
| Vibrant Styling | Very distracting to the user <br> not very professional <br> can be overwhelming to those with epilepsy and other photo-sensitivity conditions |
| Over-complicated UI | Can be overwhelming to the user <br> can be difficult to navigate <br> As little clicks to a task or a webpage as possible |

## Conclusion

We aim to create a centralized platform that enables developers, our end users to manage their tasks and store key information in a single location. By focusing first on a user-friendly, minimialistic design, we can ensure that our product is both functional and usable and friendly to all populations of developers. From there, we will iterate and add new features that complement the design and enhance the overall user experience. By Packaging this in a Desktop Application with Electron, we can either default to using the web application or extend to a mobile application using Electron as our installer/launcher. Ultimately, we take this project in stride and hope to create an engaging, functional, and autonomous application that requires little-to-no dependencies on external services and APIs, and can last long after this cohort of CSE 110.

We thank you for the opportunity to present our pitch and we hope that you consider our project for the next 5 weeks.
