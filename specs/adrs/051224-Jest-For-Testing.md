---
# status: accepted
# date: 05-12-2024
---

# Use Jest for in-depth testing.

## Context and Problem Statement

Testing is a crucial aspect of our framework, and it is required to ensure that our code is completely functional and meets the highest quality standards. As software engineers, we know that we cannot put a product out without it being completely refined and tested. Thus, we posed the following questions to ensure that we meet these standards:

- How do we ensure that we are able to test every aspect of the features we develop?
- How do we reduce the amount of work that testing takes, and ensure that tests are easy and quick to write?

## Considered Options

- Jest
- Mocha

## Decision Outcome

Chosen option: Jest, because it comes out best in terms of the balance struck between simplicity, familiarity, and utility. Given our prior experience with Jest, as well as its lightweight nature, we believed this to be the superior option. Since our project primarily lives in the user's file system, using a lightweight testing framework lessens code complexity and is modular with respect to our project.

## Pros and Cons of the Options Considered

### Jest

- Pro: Minimal configuration. Jest is a very easy framework to use, and a developer can get started on it within minutes as there is very little set up involved. This works very well for our project, as developers can immediately get into testing without needing to set up entire environments for the same.
- Pro: Easy mocking. Due to Jest's custom resolver for imports, we can mock up objects that are outside a test's scope. This allows us to test aspects of our product such as integration with other components.
- Pro: Familiarity, established tool. We have had prior experience with Jest in our lab, and it is also one of the most prominent choices for many web developers. Given the tried and tested nature of Jest, it seemed the best tool to us.
- Neutral: Learning curve. Complex aspects of Jest take a while to learn to use. However, we embrace this challenge, as we think this is a tool that will benefit us in the long-term of both this project and our future SE endeavours.
- Con: Slow performance. Compared to other testing frameworks, Jest tends to be a bit slower. This is an addressed risk, as we do not think that the time difference between testing frameworks will be particularly impactful within our time constraints.

### Mocha

- Pro: Flexibility. Mocha is very flexible and allows for a large amount of configuration in testing, giving the developers a lot of control with testing.
- Pro: Established tool. Mocha is a testing framework used by many JavaScript developers, and is tried and tested to be true.
- Con: Configuration overhead, heavyweight tool. Mocha requires a lot of set-up for developers to use, and we decided that since we were already familiar with a framework that met our specifications, a large amount of set-up was an undesirable feature of a testing framework.
