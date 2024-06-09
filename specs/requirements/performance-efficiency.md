# Performance Efficiency

## Definition

Our team defines performance efficiency as the capability of the software to provide appropriate performance relative to the amount of resources used under stated conditions. In our dev journal, this involves optimizing the app to perform tasks quickly and effectively while utilizing minimal system resources such as CPU, memory, and network bandwidth.

## Target

Our target is for our app to work as intended on all expected forms of local machines. As a team, we made many of these decisions at the beginning of the development process, that we would be achieving these objectives through how we structured our developer journal. These included the following points:

-   The developer journal must be a desktop application that runs smoothly without the reliance on internet
-   Ensure the app complies with major operating systems (Windows, MacOS, Linux)
-   Support for thin-window screens and wide-window screens
-   Ensure the app is properly functional during online to offline switches (and vice versa).

## Design Elements

Our app is designed to be as minimal as possible, emphasizing the functionality of our app to work as intended before adding any "wanted" features and focusing only on the "needed" features. As a result, we employ graceful degradation on less capable devices and older systems, ensuring the functionality works the same as on newer, more capable devices. In addition, our app is meant to work offline, regardless of whether the user has internet or not. This is to ensure efficiency of the wherever the user is, and not requiring the demand of internet access. Since our app does not rely on the internet, it is therefore compatable with any system that can download desktop applications, and not worry about connection issues.

## Testing

-   Unit testing: We write unit tests for all individual functions and modules to verify their correctness and isolate issues quickly. This helps maintain the integrity of the codebase as new features are added.
-   Stress testing: Testing the app's load and response times and capabilities on tests that include different speeds, in order to ensure that it works on different user's internets.
-   Styling testing: Check the app has consistent styling on different size screens, ensuring it does not overflow incorrectly or create bugs on thinner or wider screens. Ensure that all required elements are still visible.
