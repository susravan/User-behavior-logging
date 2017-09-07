from flask import Flask, request, render_template, redirect,\
        url_for, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from flask_cors import CORS
import simplejson as json
import sqlite3 as sql
import datetime
import time
import os
import flask_login

app = Flask(__name__)
CORS(app)
app.secret_key = "\xb6\xff7\xcdU\x80\xa6\xf6\xda\xe7&\xae\x80l\x90\xa9\xb5\x81\xc2A\x8f\xc6\xad,"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite3:////UserTracking.db"

# Create the sqlalchemy object
db = SQLAlchemy(app)

# Global variable
entered_UserId = ""

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
    userDetails = []
    username = request.args.get('userId')
    
    with sql.connect("UserTracking.db") as connection:
        
        c = connection.cursor()
        c.execute('SELECT evt_type, pageHTML, evt_datetime FROM UserActions where userId = ? ORDER BY tmStamp DESC', [username])
        userDetails = c.fetchall()
    
    posts = []
    for info in userDetails:
        post = info[0] + " --> " + info[1] + " --> " + info[2]
        posts.append(post)

    return render_template("index.html", posts=posts)


# By default, flask assumes GET method
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    with sql.connect("UserTracking.db") as connection:
        c = connection.cursor()
      
        if request.method == 'GET':
            # print "INSIDE GET REQUEST"
            c.execute('SELECT userId, loginDataTime FROM UserHistory ORDER BY tmStamp DESC')
            loginHistory = c.fetchall()
            print "loginHistory = ", loginHistory

            logins = []
            for loginHis in loginHistory:
                login = loginHis[0] + " --> " + loginHis[1]
                logins.append(login)

            print logins
            return render_template("login.html", error=error, logins=logins)
    
    with sql.connect("UserTracking.db") as connection:
        c = connection.cursor()
        
        username = request.form['username']
        password = request.form['password']

        if request.method == 'POST':
            validCount = c.execute('SELECT count(password) FROM UserDetails WHERE userId = ? and password = ?', [username, password]).fetchall()[0][0]
            print "validCount = ", validCount

            if validCount == 0:
                error = "Invalid credentials. Please try again"
            else:
                session['logged_in'] = True
                # Maintain global variable to store current username
                global entered_UserId
                entered_UserId = username
            
                # Get login time
                now = datetime.datetime.now()
                curr_time = now.strftime("%Y-%m-%d %I:%M:%S %p")
                curr_timestamp = int(time.time())
                print curr_timestamp

                c.execute('INSERT INTO UserHistory VALUES (?,?,?)', [username, curr_time, curr_timestamp])
                return redirect(url_for('home', userId=request.form['username']))

        return render_template("login.html", error=error)


@app.route('/adduser', methods=['GET', 'POST'])
def adduser():
    info = ""

    if request.method == 'POST':
        
        if not request.form['username'] or not request.form['password']:
            info = "Login credentials cannot be empty"
        else:
            with sql.connect("UserTracking.db") as connection:
                c = connection.cursor()
                userExists = c.execute('SELECT count(password) FROM UserDetails WHERE userId = ?', [request.form['username']]).fetchall()[0][0]
                if userExists != 0:
                    info = "UserId already exists"
                else:
                    c.execute('INSERT INTO UserDetails VALUES(?,?)', [request.form['username'], request.form['password']])
                    loginInfo = c.fetchall()
                    info = "User created"
        return render_template("adduser.html", info=info)
    
    # Get request
    else:
        return render_template("adduser.html")


@app.route('/TrackingData', methods=["POST"])
def TrackingData():

    req_json = request.get_json()
    evtData = req_json['evtData']
    quesData = req_json['quesData']

    with sql.connect("UserTracking.db") as connection:
        c = connection.cursor()
        c.execute('INSERT INTO UserActions VALUES(?,?,?,?,?,?)', \
            [entered_UserId, evtData['evt_type'], evtData['pageHTML'], \
            evtData['object_id'], evtData['evt_datetime'], evtData['evt_timestamp']])
        # Future work - If object_id already exists, dont insert the column again
        if quesData != None:
            c.execute('INSERT INTO ObjectDetails VALUES(?,?,?,?,?,?,?,?)', \
                [quesData['object_type'], quesData['object_id'], quesData['pageHTML'], quesData['votes'], \
                quesData['answers'], quesData['views'], quesData['DateTime'], quesData['Tags']])

    return ""


@app.route('/logout')
@login_required
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(ssl_context=('cert.pem', 'key.pem'), debug=True)
