# Functional Stability

## Definition

Our team defines functional stability as the means to determine the software's ability to run without unexpected terminations or unexpected behavior. In our dev journal, this is done by ensuring the app is able to run reliably and consistently on a user's internet and local machine to ensure quality usage of our app.

## Target

Our target is to achieve these overlying functions, ensuring that our app can execute these items without issue. These are part of our key ideologies when creating our developer journal, as guidelines and target points that we must hit in order for our components to be considered done.

-   Achieve a maximum of 2 seconds response time during normal loads
-   Ensure constant uptime during app usage
-   Page buttons correctly switch pages, popup buttons correctly summon the correct popup component
-   User inputted data is correctly stored on the database

## Design Elements

Our app emphasizes minimalism, ensuring that all the intended functionalities of the developer journal are able to be successfully completed without unneccessary add-ons or "wants" in place of "needs". In order to do this, we have our app use minimal pages, using only 3 pages, to ensure all data is not sporatically dispersed. We have three views: Main (calendar) view, all tasks view, and vault view. The small amount of pages ensure there is minimal chance for the app to be overloaded due to too many windows being open. Additionally, we have a single database to grab the user's data from to ensure no data is lost or unidentifiable during the app's usage.

## Testing

To test our functional stability, we used the following means of comparable testing,

-   Unit testing: Testing the individual functions and commands to ensure they work as intended
-   Stress testing: Testing excessively long user inputs and data
-   Styling testing: Check the app has consistent styling on different size screens
