## Instructions

- Before we begin, make sure you have a fresh version of [Node.js](https://nodejs.org/en/) and NPM installed. The current Long Term Support (LTS) release is an ideal starting point. 

- To begin, clone this repository to your computer:

    ```sh
    https://github.com/vannizhang/Pin2Flood.git
    ```

- From the project's root directory, install the required packages (dependencies):

    ```sh
    npm install
    ```

 - Now you can start the webpack dev server to test the app on your local machine:

    ```sh
    # it will start a server instance and begin listening for connections from localhost on port 8080
    npm run start
    ```

 - To build/deploye the app, you can simply run:

    ```sh
    # it will place all files needed for deployment into the /dist directory 
    npm run build
    ```