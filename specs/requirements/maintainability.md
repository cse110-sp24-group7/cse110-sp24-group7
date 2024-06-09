# Maintainability

## Definition

Our team defines maintainability as the ease at which the software can be modified to correct faults, improve performances and other attributes, and adapt to a changing environment. In our dev journal, this is done by keeping our repository clean, having well-documented code, ADRs, and comments of our development process, and clear pull requests that is meant to keep our developers informed and aware of any issues and progress.

## Target

Our target is to achieve the above objectives (repository clean, having well-documented code, ADRs, and comments of our development process, and clear pull requests) throughout the entire development process. Our team employed the mindset that if another team were to pick up our project where we left off, that they will be able to not only understand our code and general development process, but also all the nuanced decisions to our design, app construction, and each of the additions thought process throughout our team's development.

## Design Elements

Our app was constructed via modular feature and component additions, ensuring a strictly AGILE method of development. By modularizing our component creations, we were able to parallelize much of the development such that it held minimal reliance on the completion of previous tasks or other parts of the app's development. Our team had multiple subteams, playing into eachother's strengths in which areas of development we worked on, where we incremented the development in several stages. At the end of each component (feature) module's completion, it would get integrated into the mainview of our app, incorporating the backend and styling integrations, indicating it's completion.

## Testing

To test our maintainability, we used the following methods during our development progress:

-   Code Reviews: During our pull requests, we have 2+ developers review the branch and comment on any discrepencies, concerns, and overall progress of the new feature before it is pushed to our combined branch, the "dev" branch
-   Branch protection: We have multiple levels of development protection of our app, such that the main branch is only updated at the end of development, and the dev branch is the main branch for _completed_ component integration. Before that is created, we have a mainview and backend branch that incorporate these features at lower-stakes, ensuring that once the proof of concept that the components are able to be integrated correctly, it can be pushed to the dev branch via a Pull-request and assume no issues.
-   biweekly meetings: Through verbal and digital note-taking progress updates and task assignments, we are able to be up to date with each developer's progress, addressing any sources of blockage or concern at that meeting.
-   Unit testing: We write unit tests for all individual functions and modules to verify their correctness and isolate issues quickly. This helps maintain the integrity of the codebase as new features are added.
