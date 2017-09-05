# Import db that is created in app.py
from app import db
# Import schema
from models import UserActions


# Create the database and db tables
db.create_all()	 # Initializes the database based on the
				 # schema defined in models.py file

# # Insert
# # db.session.deleteall(BlogPost)
# db.session.add(BlogPost("Good", "I\'m good."))
# db.session.add(BlogPost("Well", "I\'m well."))

# # Commit the changes
# db.session.commit()