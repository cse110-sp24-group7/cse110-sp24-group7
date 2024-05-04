# Team 7 Brainstorm Meeting

## Meeting Information

**Meeting Date/Time:** 05/02, 6:30PM  
**Meeting Purpose:** Brainstorm Initial Design  
**Meeting Location:** Sixth Commuter Lounge  
**Note Taker:** Samvrit Srinath

## Attendees

Samvrit, Arnav, Hashim, Matteo, Andrew, Angie, Jessica, Naina, Emma

## Agenda Items

| Item          | Description                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------- |
| Agenda Item 1 | - Discuss the three main purposes of the app: task tracking, daily reflection, and local storage.   |
| Agenda Item 2 | - Brainstorm possible approaches including Month View and Week View with Day by Day breakdown.      |
| Agenda Item 3 | - Determine if a sidebar is necessary or if a popup could suffice for additional functionalities.   |
| Agenda Item 4 | - Define the structure of task and journal objects, including required fields and markdown support. |
| Agenda Item 5 | - Discuss the actual structure of the view for the task objects                                     |

## Discussion Items

| Item         | Who                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| App Purposes | All: Explore the feasibility and user experience of the proposed functionalities.                      |
| Designing    | Jessica, Hashim, Arnav, and Samvrit will discuss feasability and how we can deisgn                     |
| Miro         | All members will arrive for a **Work Party** on Friday to discuss items and flush out Miro Board Flows |

## Decisions Made

-   The app will serve three main purposes: task tracking, daily reflection, and local storage of files.
-   Two design approaches will be explored: Month View and Week View with a Day by Day breakdown.
-   Day by Day View could be ever present in the right hand-side sidebar
-   Task objects will include fields for Due Date, Priority, Label, Expected Time, and Description with markdown support.
-   Journal objects will consist of Date, Title, and Description with markdown support.
-   A Vault will be available for Users to upload code snippets, and screenshots pertinent or useful in their day to day life.

## Auxiliary Notes

N/A

# Brainstorm Artifacts

### Additional Elaboration:

#### App Purposes

The primary aim of the application is to provide users with a versatile tool for managing their tasks effectively, reflecting on their daily activities, and securely storing important files locally on their device. By combining these functionalities, the app seeks to streamline users' workflow and enhance productivity.

#### App Design Approaches

During the discussion, two main design approaches were proposed: a Month View similar to Google Calendar and a Week View akin to Todoist. The Month View offers an overarching perspective, allowing users to plan and organize tasks for longer durations. On the other hand, the Week View provides a more detailed breakdown of tasks on a day-to-day basis, facilitating granular planning and execution.

#### Sidebar vs. Popup

The team deliberated on whether to incorporate the day by day view as a popup or a Sidebar, we are continuing to iterate upon this and are unsure what direciton to take --> we will see in lo-fi and hi-fi models the perception of each.

#### Object Structures

To ensure consistency and clarity in data management, the team outlined the structure of task and journal objects.
Task objects will encompass essential attributes such as Due Date, Priority, Label, Expected Time, and Description, with markdown support for enhanced formatting.

Similarly, journal objects will feature Date, Title, and Description fields, enabling users to document their thoughts and experiences efficiently.
We will also use our **Sentiment Widget** app from the warmup as an optional field in a Journal to reflect on the day. We can use this to aggregate statistics about positivity and the sentiment of a user over a given sprint.

#### Organization of Tasks + Journals

Similar to apps like **Todoist**, we will create a marked **divider** that dynamically shifts based on the number of tasks a user has. Likewise, under all the tasks for a given day, and all the journals for a given day, we will be able to have a dashed box with a " + " embedded within it to add a new task. this takes them to the popup to either create a new task or journal.

#### Possible Markdown Editors

Incorporating markdown editors into the project can enhance the user experience and facilitate content creation within the app. Some potential markdown editors to consider include:

-   SimpleMDE
-   CKEditor
-   Quill

After conferring with Professor Powell, we viewed it as **not feasible** to create our own custom Markdown Editor, and we aim to wrap one of these already pre-existing editors into our objects.

#### Vault Feature

The proposed Vault feature will enable users to securely upload and store files locally on their device.
These files will be organized in a grid layout, categorized into two sections: text/code snippets (stored as .txt files) and images.


#### V2/V3 Features

-  **V2**: Implement a **Kanban Board** for users to visualize their tasks in a more interactive and dynamic manner.
-  **V2**: Integrate Pomodoro Widget for possible focus on the main dashboard or as a togglable feature.
-  **V2**: Implement a **Dark Mode** for users who prefer a more subdued color scheme.
-  **V2**: Add the ability to link tasks to journals, and code snippets to tasks.(See Github Issues)
-  **V3**: Embedding Images to Journals should add Image to the Vault.
-  **V3**: Cloud Storage Integration for users to access their files across multiple devices.
-  **V2**: Have the ability to segment tasks with multiple projects, and have a Project Dashboard view that shows all tasks for a given project, and swap between projects.