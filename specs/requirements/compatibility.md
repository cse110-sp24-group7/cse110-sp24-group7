# Compatibility

## Definition

Our team describes compatibility as the ability of the software to coexist with other systems, sharing resources and operating in a manner that doesn't degrade any system functionality. For our dev journal, this is done through ensuring our app is able to handle all types of different systems, which includes internet capabilities, storage, screen size, and platforms.

## Target

Our target is for our app to work as intended on all expected forms of local machines. Using a standard desktop's capabilities as reference, we extended our targets to include the different operating systems and screensizes of different machines.
- Create a desktop application that runs smoothly on a standard desktop
- Ensure the app complies with major operating systems (Windows, MacOS, Linux)
- Support for thin-window screens and wide-window screens
- Ensure the app is properly functional during online to offline switches (and vice versa)

## Design Elements
Our app is designed to work offline, regardless of whether the user has internet or not. This is to ensure stability and compatability wherever the user is, and not requiring the demand of internet access. Since our app does not rely on the internet, it is therefore compatable with any system that can download desktop applications, and not worry about connection issues. Because of our minimal app design, we employ graceful degradation on less capable devices and older systems, ensuring the functionality works the same as on newer, more capable devices.

## Testing
- Unit testing: Testing the individual functions and commands to ensure they work as intended
- Stress testing: Testing the app's load and response times and capabilities on tests that include different speeds, in order to ensure that it works on different user's internets.
- Styling testing: Check the app has consistent styling on different size screens, ensuring it does not overflow incorrectly or create bugs on thinner or wider screens. Ensure that all required elements are still visible.