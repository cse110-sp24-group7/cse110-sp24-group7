# Documentation For Electron Integration>

## Role of Electron Integration>
The role of this change is to wrap the project application in electron.js.

## Intended Purpose
A launchable is created, providing an alternative to the browser and could be run on multiple devices. This also opens the door to the vault feature planned for future versions. 

## Implementation/Syntax Approaches?
Three scripts were made in total following the division suggested by Electron.js documentation, including main.cjs, preload.cjs, and renderer.cjs. LocalStorage is able to be accessed in renderer.cjs, which runs on the client side. 

To create the launchable:
```
npm run make 
```
This will create a zip file in out/, which contains the launchable.

## Requirements
The current state of the app should be encapsulated in localStorage. It should also be launchable on any OS. 

## Testing
A new test directory, playwright, was added to __tests__. This includes all test files to test the application and whether it launches as expected.

To run the tests:
```
npx playwright test
```

#### Authors

- Angie Nguyen