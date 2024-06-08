---
# status: accepted
# date: 06-01-2024
---

# Use Microsoft Playwright for in-depth testing.

## Context and Problem Statement

Testing is a crucial aspect of our framework, and it is required to ensure that our code is completely functional and meets the highest quality standards. As software engineers, we know that we cannot put a product out without it being completely refined and tested. Thus, we posed the following questions to ensure that we meet these standards:

- How do we ensure that we are able to test every aspect of the features we develop?
- How do we ensure that testing covers the end-to-end user experience on the Electron app we have built so far?
- How do we reduce the amount of work that testing takes, and ensure that tests are easy and quick to write?

## Considered Options

- Playwright
- Puppeteer
- WebDriverIO

## Decision Outcome

Chosen option: Playwright, because it comes out best in terms of usability, simplicity, and familiarity. We have worked with Puppeteer before, and Playwright's Puppeteer-like syntax is a big benefit for us. Additionally, it is usable with Electron.js, which is a vital feature since our app runs on Electron.

## Pros and Cons of the Options Considered

### Playwright

- Pro: Low configuration, overhead. Playwright can be installed with a simple `npm install`, which ties in very well with the frameworks we're using already. The overhead code is the same for all E2E tests and can be copied over from file to file easily.
- Pro: Familiarity with Puppeteer syntax. We have had prior experience with Puppeteer in our lab, and Playwright uses the same syntax with a few added functions that allow us to connect to Electron apps.
- Pro: Works with Electron. Most of the E2E testing frameworks we looked at were not compatible (or very difficult to configure) with wrapped web-apps such as Electron. The fact that Playwright is compatible and has documentation on the web on how to integrate it with Electron is a huge proponent.
- Con: Slow performance. Compared to other testing frameworks, Playwright is a bit slower. This is an addressed risk, as we do not think that the time difference between testing frameworks will be particularly impactful within our time constraints.

### Puppeteer

- Pro: Familiarity. We have used Puppeteer before and are fairly well-versed in how to use it for end-to-end testing. 
- Pro: Simplicity. Puppeteer requires very little overhead and configuration, and has a fairly easy to use test structure.
- Con: Incompatible with Electron. Through our research, we have not been able to find a way to test Electron apps with Puppeteer. While we could test website versions of the app, this seemed like a fairly big hurdle to development.

### WebDriverIO

- Pro: Compatible with Electron. The Electron documentation indicates that this is a good tool to use for E2E testing, and it is compatible. 
- Con: Lack of familiarity. Compared to other tools we considered, we are complete novices in using WebDriverIO. Since we do not have the time within our timeline to learn an entirely new tool to the point of proficiency, and since other tools with Puppeteer syntax are available to us, we decided this was a deal-breaker.