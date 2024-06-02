# Style Guide for all Developers

## General
- Comment all code thoroughly, especially if implementing logic that isn't evident from variable names.
- Use descriptive variable and class names with camelCasing. 
- DB entries and attributes should be separated by underscores. 
- Use braces for all control structures (if, for, etc.). Even if a conditional has one line of code under it, bracket it. 
- Do not create circular dependencies.
- Use in-line brackets. 
- When naming a test file, name it "component".test.js
- Use JSDoc comments before methods and large sections of code that should be highlighted in the generated docs. 
- When indenting, use a 4-space indent. 
- If a line of code becomes too long (discretion of the developer), segment it into two lines using an 8-space indent before the succeeding line.
- Use `let` and `const`, never `var` in JS. 