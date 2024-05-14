---
# status: accepted
# date: 05-12-2024
---

# Use Prettier to ensure consistent code styling.

## Context and Problem Statement

When beginning our first sprint towards the final product, we came to the collective decision that we wanted to enforce better code styling between all devs, for the purposes of both readability and consistency. Since we're all working on the same product within a short time-frame, the code one developer writes will likely be used and edited by most other developers on the team. We thus posed ourselves the following questions:

- How do we ensure that we maintain consistent code formatting across all programs?
- How do we automate code styling to reduce the workload of the developer?

## Considered Options

- Prettier
- JS Beautifier (beautifier.io)
- Biome

## Decision Outcome

Chosen option: Prettier, because it comes out best in terms of simplicity, usability, and ease of integration. Additionally, we have prior experience with Prettier so this gives it the advantage of familiarity.

Devs have all downloaded Prettier on their local, and it is also integrated as an action on the cloud to enforce common styling when pushing to the `dev` branch.

## Pros and Cons of the Options Considered

### Prettier

- Pro: Consistent formatting. Prettier allows you to pick a consistent standard of formatting, which it then enforces on the cloud when developers push to the `dev` branch. This aligns very well with our expectations on how common styling should look.
- Pro: Automatic formatting. Prettier automatically formats poorly styled code, allowing developers to focus more on the logic of the code than the formatting.
- Pro: Easy integration. Given that we have prior experience with Prettier, integration becomes a simpler task for us. Having it on local also removes the need for cloud integration, but we chose to use both for maximal results.
- Pro: Familiarity, established tool. We have had prior experience with Prettier, and it is also the go-to choice for most web developers. Given the tried and tested nature of Prettier, it seemed the best tool to us.
- Neutral: Steep learning curve. While Prettier does take a while to learn and set up, this is a non-issue for us due to the familiarity we have with it.
- Con: Limited configurability. Prettier cannot go as in-depth into the styling as other options can, but this was an addressed risk as we decided we did not need such heavy styling anyway.

### JS Beautifier

- Pro: In-depth control. JS Beautifier allows you to customize your styling very in-depth.
- Pro: Established tool. JS Beautifier is a commonly used web tool by many developers, and is tried and tested to be true.
- Con: Manual use. We have read a lot about JS beautifier being difficult/impossible to integrate with the cloud, and this was a core tenet of our problem statement posed above. Thus, we could not proceed with this tool.

### Biome

- Pro: Fast performance. Reports claim that Biome runs at many times the speed that Prettier does, making it a more viable option for very rapid development.
- Pro: Simple installation. Biome requires only one dependency to be installed.
- Con: Incomplete support. Biome does not have complete support for CSS just yet, which is a very significant part of our coding and a non-negotiable factor.
- Con: Buggy. Reports show that Biome integration with VS Code, our primary code editor, can be very buggy. Thus, we decided not to go forward with this option.
