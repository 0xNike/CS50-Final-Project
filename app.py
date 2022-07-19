from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from cs50 import SQL

# Configure application
app = Flask(__name__)


# Ensures templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Configure Database
db = SQL("sqlite:///blackjack.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET","POST"])
def index():
    
    if request.method == "POST":

        currentHealth = request.form.get("exportHealth")
        if (currentHealth == ""):
            currentHealth = session['curr_health']

        print("app.py/homeroute: Saved current health at: " + str(currentHealth))

        session['curr_health'] = currentHealth
        return render_template("index.html", currentHealth=currentHealth)
    
    else:
        
        session['curr_health'] = 100
        currentHealth = session['curr_health']
        return render_template("index.html", currentHealth=currentHealth)


@app.route("/blackjack", methods=["GET","POST"])
def blackjack():
    
    if request.method == "POST":

        w_scores = request.form.get("export-wscores")
        p_scores = request.form.get("export-pscores")

        if (w_scores == None):
            w_scores = 0
            p_scores = 0

        print("Current Wojak scores: " + str(w_scores))
        print("Current Player scores: " + str(p_scores))
        db.execute("UPDATE scores SET w_score = ?, p_score = ?", int(w_scores), int(p_scores))

        currentHealth = request.form.get("exportHealth")
        if (currentHealth == ""):
            currentHealth = session['curr_health']

        print("app.py/blackjack: Saved current health at: " + str(currentHealth))
        session['curr_health'] = currentHealth

        return render_template("blackjack.html", currentHealth=currentHealth, w_scores=w_scores, p_scores=p_scores)

    else: 
        
        w_scores = 0
        p_scores = 0
        db.execute("UPDATE scores SET w_score = ?, p_score = ?", w_scores, p_scores)
        currentHealth = session['curr_health']
        print('app.py/blackjack: Loaded Current health at: ' + str(currentHealth))
        return render_template("blackjack.html", currentHealth=currentHealth, w_scores=w_scores, p_scores=p_scores)


@app.route("/direction", methods=["GET","POST"])
def direction():

    if request.method == "POST":

        currentHealth = request.form.get("exportHealth")
        if (currentHealth == ""):
            currentHealth = session['curr_health']
        
        print("Saved current health at: " + currentHealth)
        session['curr_health'] = currentHealth
        return render_template("direction.html", currentHealth=currentHealth)

    else:

        currentHealth = session['curr_health']
        print("app.py/direction: Loaded Current health at: " + str(currentHealth))
        return render_template("direction.html", currentHealth=currentHealth)