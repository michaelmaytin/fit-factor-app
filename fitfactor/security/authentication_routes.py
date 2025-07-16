#authentication networking here like Post and get routing

#should contain endpoints or routes like /log in/log out
#networking and interface portion of authentication process
#calls funcitons in authentication service to perform authentication logic upon web route interaction
#_________________________________________________________

from fitfactor.extensions import db
from fitfactor.models import User
from flask import Blueprint, request, jsonify

# modular subsection of main routes
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


#POST /api/auth/login
#route waits to accept login credential data from React
@auth_bp.route("/login", methods=["POST"])
def login():
    #extract email and password
    data = request.get_json() or {} #empty dict if no json available to prevent crash

    # frontend sends entered credentials to temp json request body, (from axios.post)
    # this picks up from temp json body
    email = data.get("email")
    password = data.get("password")


    return jsonify({
        "test email:": email,
        "test password": password
    }), 200 #test message for now






#will be connected to frontend via login.jsx thru axios