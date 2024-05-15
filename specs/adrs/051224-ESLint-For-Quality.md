---
# status: accepted 
# date: 05-12-2024
---
# Use ESLint to ensure consistent code quality.

## Context and Problem Statement

Code quality is a vital aspect of optimal development, and it's something our team prioritizes heavily. Throughout the course of the project, we strive to maintain good quality code. We came up with the following questions to help us decide on a tool:
* How do we ensure that we maintain consistently maintainable, scalable, and reliable code across all programs?
* How do we automate code quality checks to reduce the workload of the developer?

## Considered Options

* ESLint
* CodeClimate
* Codacy

## Decision Outcome

Chosen option: ESLint, due to its advantages via configurability, usability, and integratability. Additionally, we have prior experience with ESLint so this gives it the advantage of familiarity. 

## Pros and Cons of the Options Considered

### ESLint
* Pro: Consistent and configurable conventions. ESLint allows for a very high level of customizability, allowing us to configure the conventions we want developers to follow exactly. When it is applied, it then applies these conventions to all developers' code when it is being integrated into the `dev` branch, meaning no poor quality code is allowed through.
* Pro: Familiarity, established tool. ESLint is one of the most widely used tools for code quality checks in the web development community, and is one that we are familiar with. Thus, it is easier to set up than some of the other tools mentioned here.
* Pro: Usability for code formatting. Though this is not something we intend on using due to a [prior ADR](/specs/adrs/051224-Prettier-For-Styling.md), it is useful that ESLint is a formatter as well, providing an already integrated backup should we change our decision. 
* Con: Hard to set up, large configuration overhead: ESLint is notoriously time-consuming to set up with specific configurations. Its customizability is a double-edged sword in this way, as it leads to larger long-term benefits but requires a large amount of set up and overhead.

### CodeClimate
* Pro: Objective analysis. CodeClimate provides an objective analysis of code quality in a repository and provides tools and tips to fix it. This would be a very useful tool for development if we manually check it periodically. 
* Pro: Maintainability Index. Preliminary research shows that CodeClimate provides a maintainability index which identifies hard to maintain code. Though this would be useful for a very long-term project, we are more concerned with short-term development and long-term benefits, so we decided that this was a non-issue.
* Con: Cost. CodeClimate can be a costly tool for developers, and since we are working to produce a project free-of-cost, this is a deal breaker for us.

### Codacy
* Pro: Integration and automation. Codacy monitors and enforces code quality standards on every PR created.
* Pro: Security analysis. Codacy checks for security issues and provides information on how to strengthen user security.
* Con: Cost. Codacy can be a costly tool for developers, and since we are working to produce a project free-of-cost, this is a deal breaker for us.