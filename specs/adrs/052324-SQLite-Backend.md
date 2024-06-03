---
# status: accepted
# date: 05-23-2024
---

# Use SQLite as the database library to manage persistent storage.

## Context and Problem Statement

Previous ADRs of our product considered various options for wrapping our application to access local filesystems. This ADR considers the specific libraries used to achieve such goals. Some specific questions to consider for each option are:

-   What format is data stored as for each option?
-   How well do these libraries perform with different amounts of data?
-   How will the complexities of each library affect the team's learning curve to use them?

## Considered Options

-   SQLite3
-   MySQL
-   electron-store

## Decision Outcome

Chosen option: SQLite3, because it provides the best balance between simplicity and performance. Our application doesn't require millions of data entries, making the performance difference between MySQL and SQLite3 negligible. SQLite3 supports SQL design databases, fitting our entity-relations better than the key-value storage offered by electron-store. Additionally, SQLite3 is as accessible as electron-store, aiding the backend team in quickly implementing data routes.

## Pros and Cons of the Options Considered

### SQLite3

-   Pro: Simple setup and usage.
-   Pro: Suitable for applications with moderate data requirements.
-   Pro: No need for a separate server process.
-   Pro: Supports complex queries and relationships.
-   Pro: Lightweight and portable.
-   Con: Limited concurrency handling compared to MySQL.
-   Con: Not ideal for very large-scale applications.

### MySQL

-   Pro: Handles large-scale applications well.
-   Pro: Strong concurrency support.
-   Pro: Robust security features.
-   Pro: Widely supported and documented.
-   Con: Requires a separate server process.
-   Con: More complex setup and maintenance.
-   Con: Potential overkill for moderate data requirements.

### electron-store

-   Pro: Extremely simple setup and usage.
-   Pro: Ideal for small-scale data storage.
-   Pro: No need for SQL knowledge.
-   Pro: Very lightweight.
-   Con: Limited to key-value storage, unsuitable for complex data relationships.
-   Con: Not designed for handling large datasets.
-   Con: Lacks the advanced querying capabilities of SQL databases.
