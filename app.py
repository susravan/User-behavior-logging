from flask import Flask, request, render_template, redirect,\
        url_for, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from flask_cors import CORS
import simplejson as json
import sqlite3 as sql
from datetime import datetime,timedelta
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
    
    # Get action and its details and send it to index.html 
    with sql.connect("UserTracking.db") as connection:
        c = connection.cursor()
        c.execute('SELECT evt_type, pageHTML, evt_datetime FROM UserActions where userId = ? ORDER BY tmStamp DESC', [username])
        userDetails = c.fetchall()
    
    posts = []
    # Not required when visualizations are shown
    # for info in userDetails:
    #     post = info[0] + " --> " + info[1] + " --> " + info[2]
    #     posts.append(post)

    return render_template("index.html", posts=posts, userId=username)

# Endpoint to get chart data
@app.route('/barchartdata', methods=['GET'])
def barchartdata():
    # Weeks to show on the X-axis of the bar chart
    DateRange = [["-56 days", "-49 days"],["-49 days", "-42 days"],["-42 days", "-35 days"],["-35 days", "-28 days"],["-28 days", "-21 days"],["-21 days", "-14 days"],["-14 days", "-7 days"],["-7 days","-1 second"]]
    
    # To add additional events, change index.html, add event in below list, set default in index.js
    BarChartData = []
    Index = 0   # Index is used for time axis ordering in the chart
    EventList = ["Visited", "UpVoted", "DownVoted"]

    # Get data for each week interval
    for start, end in DateRange:
        # Get X-axis data string
        tempDict = getDateRange("UserTracking.db", start, end)
        DateAxes = tempDict[0]['StartDate'] + " to " + tempDict[0]['EndDate']
        
        BarData = [{'Index':Index, "DateAxes": DateAxes}]
        
        # For each event
        for event in EventList:
            percent = getBarGraphTimeData("UserTracking.db", start, end, event)[0]["Percent"]
        
            if percent == None or percent == 0:
                BarData[0][event] = 0.5
            else:
                BarData[0][event] = percent

        BarChartData.extend(BarData)
        Index += 1
    
    return jsonify(BarChartData)

# Returns the bar chart data with StartDate, EndDate and percentage of total actions
def getBarGraphTimeData(DBName, StartDate, EndDate, Event):
    with sql.connect(DBName) as connection:
        conn = connection.cursor()
        conn.execute("SELECT (STRFTIME('%m/%d', DATETIME('now', ?))) as StartDate,  STRFTIME('%m/%d', DATETIME('now', ?)) as EndDate, \
            ( \
                    ( \
                        SELECT COUNT(evt_type) FROM UserActions \
                        WHERE evt_type = ? AND userId = ? \
                        AND tmStamp >= STRFTIME('%s', DATETIME('now', ?))*1000 \
                        AND tmStamp < STRFTIME('%s', DATETIME('now', ?))*1000 \
                    ) \
                        / \
                    ( \
                        ( \
                            SELECT COUNT(evt_type) FROM UserActions \
                            WHERE evt_type = ? \
                            AND tmStamp >= STRFTIME('%s', DATETIME('now',?))*1000 \
                            AND tmStamp < STRFTIME('%s', DATETIME('now',?))*1000 \
                        ) /100.0 \
                    ) \
            ) \
        AS Percent", [StartDate, EndDate, Event, entered_UserId, StartDate, EndDate, Event, StartDate, EndDate])
        
        chart_data = [dict((conn.description[i][0], value) \
            for i, value in enumerate(row)) for row in conn.fetchall()]
        conn.close()

        return chart_data
        

# Returns the start and end dates
def getDateRange(DBName, StartDate, EndDate):
    with sql.connect(DBName) as connection:
        conn = connection.cursor()
        conn.execute("SELECT STRFTIME('%m/%d', DATETIME('now', ?)) as StartDate, \
                            STRFTIME('%m/%d', DATETIME('now', ?)) as EndDate", [StartDate, EndDate])
        
        time_data = [dict((conn.description[i][0], value) \
            for i, value in enumerate(row)) for row in conn.fetchall()]

        conn.close()
        return time_data


# Endpoint to get chart data
@app.route('/VisitsPiechart', methods=['GET'])
def chartdataQA():
    return jsonify(getTagDataByEvent("Visited"))

# Endpoint to get chart data
@app.route('/AnswersPiechart', methods=['GET'])
def chartdataPA():
    return jsonify(getTagDataByEvent("Posted Answer to"))

def getTagDataByEvent(event):
    with sql.connect("UserTracking.db") as connection:
        conn = connection.cursor()
        conn.execute('select label, count from \
            ( \
                select tag as label, count(tag) as count FROM \
            ( \
                select distinct userId, evt_type, SUBSTR(tags, 0, instr(tags,"^")) AS tag , tmStamp from  \
                ( \
                    select * from useractions \
                    where evt_type = ? AND userId = ? \
                ) ua \
                inner join ObjectDetails ob \
                on ua.object_id = ob.object_id \
            ) t \
            group by tag \
            ) \
            order by count desc \
            LIMIT 5', [event, entered_UserId])

        chart_data = [dict((conn.description[i][0], value) \
            for i, value in enumerate(row)) for row in conn.fetchall()]
          
        conn.close()
        return chart_data


# By default, flask assumes GET method
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    with sql.connect("UserTracking.db") as connection:
        c = connection.cursor()
      
        # If GET request display the login user and time details
        if request.method == 'GET':
            c.execute('SELECT userId, loginDataTime FROM UserHistory ORDER BY tmStamp DESC')
            loginHistory = c.fetchall()
            # print "loginHistory = ", loginHistory

            logins = []
            for loginHis in loginHistory:
                login = loginHis[0] + " --> " + loginHis[1]
                logins.append(login)

            # print logins
            return render_template("login.html", error=error, logins=logins)
    
    with sql.connect("UserTracking.db") as connection:
        c = connection.cursor()
        
        username = request.form['username']
        password = request.form['password']

        # If POST request - validate the username and password and go to next page if valid
        if request.method == 'POST':
            validCount = c.execute('SELECT count(password) FROM UserDetails WHERE userId = ? and password = ?', [username, password]).fetchall()[0][0]
            # print "validCount = ", validCount

            if validCount == 0:
                error = "Invalid credentials. Please try again"
            else:
                session['logged_in'] = True

                # Maintain global variable to store current username
                global entered_UserId
                entered_UserId = username
            
                # Get login time
                now = datetime.now()
                curr_time = now.strftime("%Y-%m-%d %I:%M:%S %p")
                curr_timestamp = int(time.time())
                # print curr_timestamp

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
