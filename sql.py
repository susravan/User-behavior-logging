import sqlite3 as sql

with sql.connect("UserTracking.db") as connection:
	c = connection.cursor()
	c.execute("DROP TABLE UserActions")
	c.execute("CREATE TABLE UserActions(question_id INT, votes INT, answers INT, views TEXT)")

	