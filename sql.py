import sqlite3 as sql

with sql.connect("UserTracking.db") as connection:
	c = connection.cursor()
	# c.execute("DROP TABLE UserActions")
	c.execute("CREATE TABLE UserActions(userId TEXT, evt_type TEXT, pageHTML TEXT, object_id INT, evt_datetime TEXT)")
	# c.execute("DROP TABLE ObjectDetails")
	c.execute("CREATE TABLE ObjectDetails(object_type TEXT, object_id INT, pageHTML TEXT, votes INT, answers INT, views INT, create_datetime TEXT, tags TEXT)")



	