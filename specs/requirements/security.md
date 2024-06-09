# Security

## Definition

Our team defines security as the prevention of unauthorized access to data by both the application and other users. We aim to ensure that the user's privacy is completely protected from both parties. As such, we have built our app and all calls to file-storage with user security and privacy in mind, ensuring that we do not have access to any sensitive files the user may have and that a user's app is specific to them.

## Target

Our goal for security is for our application to be able to maintain all data within a secure section of the user's storage, so that the user's data is at the same level of protection that their file system is at. Further, we want to make sure that each application opened is entirely user-specific, and is not liable to security breaches by third parties. We have made sure that our app opens only a single folder in their local file system for accessing and storing data.
Key Tenet: **User files in one local directory**

## Testing

We made sure that all the files that a user uploads to the vault are stored in the user's local AppData, specifically in one folder designated for our app. This was tested via the upload of several different types of files and their cross-reference in the file storage system. We also have unit and end to end tests in place to test the file storage system and the vault's functionalities. Of particular note is the fact that each app instance is user-specific; the usage of file systems instead of cloud storage allows us to eliminate the need for the network's involvement in any processes. Our app's local-first structure makes it a completely secure application, with the security of a user's data being tied to the strong security of the user's file system in the first place.
