Implementation Details:
The assignment is implemented using flask (python 2.7) and sqlite3 for backend and javascript, jquery for frontend
Folder structure: Main folder contains following folders.
	Page-tracking-extension - contains all the browser extension files
	static - css and jquery files
	templates - html pages

Setup Details:
Since the project is implemented in sqlite3 without ORM, it doesn't need any standalone database installation. However some python packages are required which are mentioned in requirements.txt in main project folder.
"requirements.txt" is formed using "pip freeze > <file_name>" which lists out all the packages used in the project. To install all these packages, simply run "pip install -r requirements.txt" from project folder

Database is present in UserTracking.db which four tables.
	UserActions - Main table to store user actions to access them in profile page
	UserDetails - LogIn and password details pf the user - Already contains 3 users
	UserHistory - Stores the login history of the user
	ObjectDetails - Contains question and answer details taken from the page

Install browser extension:
1) Open Chrome and go to "chrome://extensions"
2) Make sure "Developer Mode" checkbox is checked
3) Click "Load unpacked extension" and select the Page-tracking-extension folder in the project directory
4) Make sure it is "Enabled"
This will install the browser extension.

How to run the application:
1) Open terminal from project folder
2) Install dependencies - "pip install -r requirements.txt"
3) Run "python app.py" - this starts the server
4) Open browser and access "https://localhost:5000" 
	--- OR ---
   Click on "Go to HomePage" button in the popup of chrome extension

Features Implemented:
1) Login page shows a form to take login and password data, shows previous login history
2) Once logged in, app redirects to profile page where you can see the description of the actions being tracked and the user's behavioral logging data
3) At each screen, you have an option to add new user by clicking on "Add User" which redirects to another page to take new userid and new password as input
4) The application already consists of three users - "aaa", "bbb" and "ccc", all with password - "123"
5) Six actions are begin tracked by the application and it's details can be see in profile page once logged in

Note:
1) The web application is using a https server
2) Starting page for the application would be /login.html
3) Local URL - https://localhost:5000
