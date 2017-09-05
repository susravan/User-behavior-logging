from app import db

class UserDetails(db.Model):
	__tablename__ = "UserDetails"

	# Three variables goes to three columns in the database
	user_id = db.Column(db.Integer, primary_key=True)
	user_name = db.Column(db.String, nullable=False)
	password = db.Column(db.String, nullable=False)

	def __init__(self, user_name, password):
		self.user_name = user_name
		self.password = password

	def __repr__(self):
		return '{}-{}-{}'.format(self.user_id, self.user_name, self.password)


class UserHistory(db.Model):
	__tablename__ = "UserHistory"

	# Three variables goes to three columns in the database
	user_id = db.Column(db.Integer, primary_key=True)
	login_date = db.Column(db.String, nullable=False)
	login_time = db.Column(db.String, nullable=False)

	def __init__(self, login_date, login_time):
		self.login_date = login_date
		self.login_time = login_time

	def __repr__(self):
		return '{}-{}-{}'.format(self.user_id, self.login_date, self.login_time)


class UserActions(db.Model):
	__tablename__ = "UserActions"

	# Three variables goes to three columns in the database
	ques_id = db.Column(db.Integer, primary_key=True)
	votes = db.Column(db.Integer, nullable=False)
	answers = db.Column(db.Integer, nullable=False)
	views = db.Column(db.Integer, nullable=False)

	def __init__(self, ques_id, votes, answers, views):
		self.ques_id = ques_id
		self.votes = votes
		self.answers = answers
		self.views = views

	def __repr__(self):
		return '{}-{}-{}-{}'.format(self.ques_id, self.votes, self.answers, self.views)

