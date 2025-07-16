#authentication networking here like Post and get routing

#should contain endpoints or routes like /log in/log out
#networking and interface portion of authentication process
#calls functions in authentication service to perform authentication logic upon web route interaction
#_________________________________________________________

from flask import Blueprint, request, jsonify
from fitfactor.extensions import db #SQLAlchemy()
from fitfactor.models import User #SQLAlchemy model



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
    if not email or not password:      #if empty data recieved
        return jsonify({ "error": "Email and Password required." }), 400 #Bad request

    #SQL alchemy lookup user by email
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404


    return jsonify({
        "test user_id": user.user_id,
        "email": user.email
    }), 200 #test message for now






#will be connected to frontend via login.jsx thru axios