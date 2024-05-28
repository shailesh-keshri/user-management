# UserManageSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

# User Management System Documentation

# Technologies Used
Angular: For building the frontend user interface.
Angular Material UI: For providing a rich set of UI components.
Firebase: For authentication, Firestore for data storage, and Firebase Storage for image storage.
Node.js: For building the backend server and handling API requests.

# Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js (version 20.12.2)
Angular CLI (version 17.3.8)
Firebase CLI (version 13.10.0)
Git

# Steps to run it locally 

1. Open the terminal and run the following command 
git clone https://github.com/shailesh-keshri/user-management.git

# Backend Setup
2. navigate to cd <project-directory>/backend and run npm install

3. Create a serviceAccountKey.json file in the backend/config directory. This file contains your Firebase service account credentials.

4. Run npm start to run the backend server.

# Frontend Setup
1. Navigate to the project directory and run npm install to install the dependencies.

2. Run the command npm start or ng serve to the run the Angular application.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# Challenges Faced

1. # Image Capture

* Challenge: Capturing images using the webcam and handling various states (e.g., opening the camera, capturing the image, closing the camera) was complex.
* Solution: Created a separate Angular component to manage the webcam and image capture logic, ensuring proper state management and user experience.

# Data Storing

* Challenge: Storing and retrieving user roles and other information in Firebase required careful handling of user state and roles.
* Solution: Used Firebase Firestore to store user data, and custom claims for managing user roles. Implemented an Angular service to fetch and manage user roles.

# Spinner and Loading States

* Challenge: Displaying and hiding a spinner during asynchronous operations without causing errors or flickering.
* Solution: Used Angular's async pipe and proper state management to control the spinner display. Ensured that the spinner was hidden correctly after operations completed.