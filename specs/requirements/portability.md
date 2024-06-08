# Portability

## Definition

Our team defines portability as the ability of our application to be used on multiple platforms. We want to make sure that our application is portable and that it can be used on any device. As such, we have made sure that our application is compatible with multiple operating systems and that it can be used on any laptop. 

## Target

To this goal we have used `electron-forge` to package our application into a PWA that can be used on any laptop(excluding mobile). While this does restrict a large portion of our intended user-base, the app is quite sizable and not very mobile-friendly, as we have to interface with a *user's own file system*, something that doesn't lend itself very well to a mobile application or website. 

As such, we have decided to focus on the laptop market, as we believe that this is where our application will be most useful as most developers will be accessing productivity tools and conducting dev efforts on a laptop. 

Key Tenet: **Electron-Forge allows for cross-platform compatibility** We have tested our application on both Windows and MacOS, a major portion of the laptop market, and have found that our application works quite well on both platforms. 

## Testing

We conducted hand-testing and "Dogfooding" on both Windows and MacOS to identify bugs and issues that may occur on either platform. This caused us to modify our `package` and `make` script to create installers native to each platform rather than a general purpose installer. Likewise, we also leveraged using other people who are native users of each platform to test our application and provide feedback. 


