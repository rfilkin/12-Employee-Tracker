# 12-Employee-Tracker
This is an app that allows users to manage a local MySQL database of Employees.

# Installation (for local version)
1. Clone this repository to your local machine.
2. Navigate to the repository directory and start up git bash.
3. Run the command "npm install" to install all necessary packages.
4. open the EmployeeDB.sql file in your local MySQL server and run it to set up the database.
5. open the seed.sql file in your local MySQL server and run it to add sample data to the database.

# Usage
1. Navigate to the repository directory and start up git bash.
2. Run the command "node start.js" in git bash to start up the app
3. use the arrow keys and enter key to make selections in the app's menus.
4. To exit the app, select the "Exit" option in the main menu.

# Notes
- The querier.js file was part of an attempt to offload the querying logic into a class, as to make server.js less cluttered. 
I wasn't quite able to finish it in time, so it's abandoned.