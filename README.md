# Problem Statement:
Adapt a webpage based on the user behaviour on that page. Once the adaptation is done, users with different interests will have to see different layout of the website.

# Approach:
**Step 1:** Develop a method to track and log user's activity on a given webpage - *Completed*

**Step 2:** Visualize the collected data interactively comparing with other users in the profile page - *Completed*

**Step 3:** Analyze the behavior log activity and adapt the website - *In the process*

## Step 1:
### Implementation Details:
In order to track the user's activity among multiple websites, I have created a browser extension which contains the event listeners on required DOM elements in the page. This extension tracks the activity on the elements and return the data in JSON format.

Implemented a flask server and SQLite3 database for backend. Once the data is collected, it is sent to server by an AJAX call. Server stored it in SQL tables. Also created a web based login system where a user can login and review his/ her own activity.

**Technologies used:** Flask (python 2.7) for server setup, SQLite3 for backend database, JavaScript, jQuery for DOM event listeners and website development


## Step 2:
### Implementation Details:
For interactive visualization, I have chosen d3.js as it is highly configurable and widely used in industry. After analyzing the data, I thought of using tags to get the user's skills from the questions he answers. To make a comparitive skill study, I made a pie chart and similarly for his visits from which we can tell his learning interests.

Used bar chart to do comparitive study of user's interactions with the website in the past 2 months with other users.

**Technologies used:** d3.js, JavaScript and jQuery


### Folder structure:
* Page-tracking-extension - contains all the browser extension files
* static - css and js files
* templates - html pages

### How to Setup:
Since the project is implemented in sqlite3 without ORM, it doesn't need any standalone database installation. However some python packages are required which are mentioned in requirements.txt in main project folder.
"requirements.txt" is formed using "pip freeze > <file_name>" which lists out all the packages used in the project. To install all these packages, simply run "pip install -r requirements.txt" from project folder

"UserTracking.db" contains four tables
1. UserActions - Main table to store user actions to access them in profile page
2. UserDetails - LogIn and password details pf the user - Already contains 3 users
3. UserHistory - Stores the login history of the user
4. ObjectDetails - Contains question and answer details taken from the page

### Running the application:
* **Browser extension:**
1. Open Chrome and go to "chrome://extensions"
2. Make sure "Developer Mode" checkbox is checked
3. Click "Load unpacked extension" and select the "Page-tracking-extension" folder in the project directory
4. Make sure it is "Enabled"
This will install the browser extension.

* **Application setup:**
1. Open terminal from project folder
2. Install dependencies - "pip install -r requirements.txt"
3. Run "python app.py" - this starts the server
4. Open browser and access "https://localhost:5000" (Can be changed in /Page-tracking-extension/manifest.json file)
	--- OR ---
   Click on "Go to HomePage" button in the popup of chrome extension

### Features Implemented:
1. Login page shows a form to take login and password data, shows previous login history
2. Once logged in, app redirects to profile page where you can see the description of the actions being tracked and the user's behavioral logging data
3. At each screen, you have an option to add new user by clicking on "Add User" which redirects to another page to take new userid and new password as input
4. The application already consists of three users - "aaa", "bbb" and "ccc", all with password - "123"
5. Six actions are begin tracked by the application and it's details can be see in profile page once logged in

### Note:
1. The web application is using a https server
2. Starting page for the application would be /login.html
3. Local URL - https://localhost:5000
