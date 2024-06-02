---
# status: accepted
# date: 05-12-2024
---

# Use Electron.js as a wrapper for our web app.

## Context and Problem Statement

One of the features of our product is that we integrate it with the user's local file system, using it to store tasks and journal entries. For this purpose, we want to consider different file storage options. Here are some questions we posed:

-   How do we provide the experience of being able to store files on our application with minimal cost to the team?
-   How do we reduce the complexity of this feature to make it a viable deliverable within our time constraints?

## Considered Options

-   Electron.js wrapper
-   External databases and the cloud

## Decision Outcome

Chosen option: Electron.js, because we want to ultimately minimize cost and complexity, and maximize the benefit to the user. Since our project is ultimately based around a web-app, we think Electron.js will be a very useful wrapper, especially when compared to the cloud and the usage of external databases. These not only incur costs to the team, but are also far more complex to integrate. This is not the sole focus of our product, so we decided to prioritize basic utility.

## Pros and Cons of the Options Considered

### Electron.js

-   Pro: Uses web development languages. Electron.js allows us to build a desktop application wrapper using the languages that we are familiar with: HTML, CSS, and JS. This reduces the need to learn a whole new language for the product.
-   Pro: Runs on Chromium. When debugging features of the product, the fact that Electron runs on Chromium allows us to use Chrome's Developer Tools. This is very useful for our project.
-   Pro: Minimal complexity and cost. This is a free-to-use tool, and is simple to implement, aligning with the philosophy we have for this feature.

### External Databases/Cloud

-   Pro: Reduced dependency on user's file system. This allows for any user to be able to use the product, and the files would be stored securely in a place where the user could not accidentally tamper with them. It is definitely the preferable option for large-scale applications involving multiple users.
-   Con: Cost. The use of external databases and cloud resources is never free, and our product is working within a zero budget. Thus, this is impossible for us to undertake.
-   Con: Complexity. Given the fact that the "Vault" is not the primary purpose of our product, the complexity involved in integrating cloud resources proves to be out of the scope of the developer workload for this project.
