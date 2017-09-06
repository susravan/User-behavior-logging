import sqlite3 as sql

with sql.connect("UserTracking.db") as connection:
	c = connection.cursor()
	# c.execute("DROP TABLE UserActions")
	c.execute("CREATE TABLE UserActions(userId TEXT, evt_type TEXT, pageHTML TEXT, question_id INT, evt_datetime TEXT)")
	# c.execute("DROP TABLE QuestionDetails")
	c.execute("CREATE TABLE QuestionDetails(question_id INT, pageHTML TEXT, votes INT, answers INT, views INT, create_datetime TEXT, tags TEXT)")



	