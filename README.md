# IOTech-Smarthome-Webapp

Welcome to our Dashboard Application! This web application is designed to display a dynamic dashboard using Node.js with Express.js for the server-side, Chart.js for creating interactive charts, and WebSockets for real-time data updates. This readme will provide you with the necessary information to get started with the application, understand its features, and make any required configurations.

---------------------------------------------------------------------------------------------------------------------------------
Before you start, make sure you have the following prerequisites installed on your system:

Node.js - the App is built on Node.js, so you will need to have Node.js installed.
npm - Node Package Manager comes with Node.js. Ensure you have the latest version.
A modern web browser - We recommend using the latest versions of Chrome, Firefox, or Edge for the best experience.

---------------------------------------------------------------------------------------------------------------------------------
Installation

Follow these steps to get our App up and running:

Clone the repository to your local machine using Git:

git clone https://github.com/On3Maker03/IOTech-Smarthome-Webapp.git

Change into the project directory:

cd path/to/WebApp

Install the required dependencies using npm:

npm install

---------------------------------------------------------------------------------------------------------------------------------
Configuration
The Application has a few configuration options that you can customize according to your needs.

Here are the key configuration options:

PORT: The port on which the server will listen.
WEBSOCKET_URL: The URL for the WebSocket server.
config.json: change to your database details

---------------------------------------------------------------------------------------------------------------------------------
Usage

To start the Webapp, run the following command:

npm start
This will start the server, and you can access the application in your web browser by navigating to http://localhost:3000 (or the port you specified in the configuration).

---------------------------------------------------------------------------------------------------------------------------------
Features

the App provides the following features:

Dashboard: A visually appealing dashboard that displays real-time data using interactive charts.

Real-Time Data: Data is updated in real-time through WebSockets, providing a dynamic and responsive user experience.

Interactive Charts: Charts created with Chart.js that allow users to interact with and explore data visually.


---------------------------------------------------------------------------------------------------------------------------------
Contributing

We welcome contributions from the community. If you'd like to improve our Webapp, please follow these guidelines:

Fork the repository to your GitHub account.
Create a new branch for your feature or bug fix.
Make your changes and commit them.
Create a pull request, detailing the changes you've made.
