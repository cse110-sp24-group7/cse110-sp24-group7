# Documentation For Vault

## Role of Vault

Vault is a comprehensive file management and organization tool designed to help users store, categorize, and retrieve various types of files and images. It serves as a centralized repository where users can upload, search, filter, and manage their files efficiently. The primary role of Vault is to provide a user-friendly interface for handling file operations, making it easier for users to keep their documents and images organized and accessible.

## Intended Purpose

The intended purpose of Vault is to streamline the process of file management for users. It aims to provide:

- Ease of Access: Allow users to quickly upload, view, and manage their files and images in one place.
- Organization: Enable users to categorize files through filtering and searching capabilities.
- User Interaction: Offer a seamless user experience with intuitive design and easy-to-use controls for file operations such as upload, delete, and search.
- Efficiency: Improve productivity by reducing the time and effort needed to find and organize files.
  
## Implementation/Syntax Approaches?
- Frontend: The frontend is built using HTML, CSS, and JavaScript. It leverages event listeners to handle user interactions and dynamically update the UI.
- File Manager: A custom JavaScript object, fileMgr, manages file operations. It handles tasks such as retrieving file names, adding new files, and deleting files.
- DOM Manipulation: JavaScript is used extensively to manipulate the DOM, updating the file and image displays in response to user actions.
- CSS Styling: CSS is used to style the interface, ensuring a consistent and visually appealing design. It includes custom styles for file items, the header, search bar, and more.
- Responsive Design: The application is designed to be responsive, ensuring usability across different devices and screen sizes.
## Requirements

Vault should be able to:

- Upload Files: Users should be able to upload multiple files simultaneously, with support for various file types (e.g., documents, images).
- Display Files: Uploaded files should be displayed in an organized manner, with appropriate icons or previews based on file type.
- Search Files: Users should be able to search for files by name or partial name, with the results dynamically updating as the user types.
- Filter Files: Users should be able to filter files by type (e.g., all files, documents, images) to quickly find the files they need.
- Delete Files: Users should be able to delete files, with a confirmation prompt to prevent accidental deletions.

## Testing

- Unit Testing: For the File Manager
- Integration Testing: Tested the vault in Electron for the integration of different components, such as file upload, search, and delete functionalities.
- UI/UX Testing: Ensured the user interface is intuitive and user-friendly.

#### Authors

- Angie Nguyen
- Deena Pederson
- Matteo Persiani
