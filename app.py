from flask import Flask, request, render_template, redirect,\
url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from flask_cors import CORS
import simplejson as json
import sqlite3 as sql

app = Flask(__name__)
CORS(app)
app.secret_key = "\xb6\xff7\xcdU\x80\xa6\xf6\xda\xe7&\xae\x80l\x90\xa9\xb5\x81\xc2A\x8f\xc6\xad,"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite3:////UserTracking.db"

# Create the sqlalchemy object
db = SQLAlchemy(app)

# Should be imported after "db" creation as models.py uses db
from models import *

# Login required decorator
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('You need to login first.')
            return redirect(url_for('login'))
    return wrap


@app.route('/') #Main URL
@login_required
def home():
    # posts = db.session.query(BlogPost).all()
    print "At homepage"
    return render_template("index.html", posts=[])  # Reder a template


@app.route('/TrackingData', methods=["POST"])
def TrackingData():
    req_json = request.get_json()

    with sql.connect("UserTracking.db") as connection:
        for jsonObj in req_json:
            c = connection.cursor()
            question_id = jsonObj["question_id"]
            votes = jsonObj["votes"]
            answers = jsonObj["answers"]
            views = jsonObj["views"]
            c.execute('INSERT INTO UserActions VALUES(?,?,?,?)', [question_id, votes, answers, views])

    # trackingObj = TrackingDetails(jsonObj)
    # print jsonObj
    # db.session.add(UserActions(jsonObj["question_id"], jsonObj["votes"], jsonObj["answers"], jsonObj["views"]))
    # db.session.commit()

    return ""


@app.route('/welcome') #Main URL
def welcome():
    return render_template("welcome.html")


# By default, flask assumes GET method
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != "admin" or request.form['password'] != "admin":
            error = "Invalid credentials. Please try again"
        else:
            session['logged_in'] = True
            flash("You just logged in")
            return redirect(url_for('home'))

            return render_template("login.html", error=error)


@app.route('/logout')
@login_required
def logout():
    session.pop('logged_in', None)
    flash("You just logged out")
    return redirect(url_for('welcome'))


class TrackingDetails(object):
    jsonObj = {};
    ques_id = 0
    votes = 0
    answers = 0
    views = 0

def __init__(self, json):
    self.jsonObj = json;

def convert(self):
    ques_id = jsonObj["ques_id"]
    votes = jsonObj["votes"]
    answers = jsonObj["answers"]
    views = jsonObj["views"]





if __name__ == '__main__':
    app.run(ssl_context=('cert.pem', 'key.pem'), debug=True)
