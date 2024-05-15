---
# status: accepted
# date: 05-12-2024
---

# Use JSDocs to ensure consistent documentation.

## Context and Problem Statement

Documentation is one of the most important standards, if not the most important, to follow during development. Above all else, it ensures that developers have easy access to different parts of the repository and can take over each other's work wherever necessary. Since collaboration and covering for one another are core tenets of our team's philosophy, we strived to find an appropriate tool to improve the documentation process for developers. These are some of the problems we considered when making our decision:

- How do we ensure consistent documentation standards for all developers?
- How do we partially automate documentation to reduce the workload of the developer?

## Considered Options

- JSDocs
- Read the Docs

## Decision Outcome

Chosen option: JSDocs, because we want a lightweight testing environment that we can configure to run only when pushing to `dev` and allowing us to approve documentation before pushing to `main`. This is an addressed risk, as we will ensure that all documentation is approved, but we wanted to reduce the set-up overhead for the developers and team.

## Pros and Cons of the Options Considered

### JSDocs

- Pro: Inline documentation by developers. With JSDocs, all developers need to do is maintain consistent inline documentation (commenting) on their code. This allows for documentation to stay in sync with the code and minimizes the amount of documentation that developers need to explicitly create.
- Pro: Tailored for JavaScript. The majority of our work will be done in JavaScript, and JSDocs is one of the highest tailored tools towards JavaScript documentation that we could find.
- Pro: Lightweight and easy integration with IDEs. Many IDEs, such as VS Code, have useful autocomplete plugins that are tailored for JSDocs, which means that we can ensure that all developers follow the specific format that we customize JSDocs to. Additionally, the tool is lightweight and easily integratable.
- Neutral: Unsuitable for non-JS projects. This is a big con for most development projects, and it is definitely an issue when it comes to HTML and CSS documentation for us. However, we consider this a non-issue as our primary language for coding (including web components and styling) will be JavaScript.

### Read The Docs

- Pro: Multiple formats. Read the Docs allows for different types of documentation, including Markdown. However, we do not consider this a huge benefit to our development, as we want to maintain a single format of documentation anyway.
- Pro: Versioning. Read the Docs supports versioning of documentation for different stages of the product. This would be useful as our product will also be versioned.
- Con: Large set-up overhead, learning curve. We tried working with Read the Docs initially, but it requires an intense amount of set-up. Given that JSDocs is a very viable option and we don't want to invest too much time into set-up due to our time constraints, we decided that this was a deal-breaker.
