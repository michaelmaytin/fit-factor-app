#authentication networking here like Post and get routing

#should contain endpoints or routes like /log in/log out
#networking and interface portion of authentication process
#calls functions in authentication service to perform authentication logic upon web route interaction
#_________________________________________________________

from flask import Blueprint, request, jsonify, make_response
from fitfactor.extensions import db #SQLAlchemy()
from fitfactor.models import User, Role #SQLAlchemy model
from fitfactor.security.password_handler import verify_pass, hash_pass
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta
from fitfactor.main.routes import api_response

#modulcar section of main routes
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/users/me", methods=["GET"])
@jwt_required()
def get_this_user():
    print("GET /users/me hit") #message for backend debug

    user_id = get_jwt_identity()
    claims = get_jwt()
    user = User.query.get(user_id)
    if not user:
        return api_response(404,  message=f"No user found")

    return api_response(200, payload={
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "role": claims.get("role"),
        "age": user.age,
        "gender": user.gender,
        "height_ft":user.height_ft,
        "weight_lbs": user.weight_lbs,
        "goal": user.goal,
    }, message="User info retrieved")




@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    username = data.get("username")
    email    = data.get("email")
    password = data.get("password")
    if not username or not email or not password:
        return jsonify({"error":"Username, email and password required."}),400

    # check dupes
    if User.query.filter_by(email=email).first():
        return jsonify({"error":"Email already registered."}),409
    if User.query.filter_by(username=username).first():
        return jsonify({"error":"Username taken."}),409

    # grab default role
    role = Role.query.filter_by(role_name="User").first()
    if not role:
        return jsonify({"error":"User role missing."}),500

    # create & commit
    new_user = User(username=username,
                email=email,
                password=hash_pass(password),
                role_id=role.role_id)
    db.session.add(new_user)
    db.session.commit()

    # issue token
    token = create_access_token(
        identity=str(new_user.user_id),
        additional_claims={"role": role.role_name}
    )
    resp = make_response(jsonify({"message":"Signup successful"}),201)
    resp.set_cookie(
        "access_token_cookie",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=60*60*24*7
    )
    return resp



#connected to frontend via login.jsx thru axios
#POST /api/auth/login
#route waits to accept login credential data from React
@auth_bp.route("/login", methods=["POST"])
def login():
    #extract email and password
    data = request.get_json() or {} #empty dict if no json available to prevent crash
    # frontend sends entered credentials to temp json request body, (from axios.post)
    # this picks up from temp json body
    entered_email = data.get("email")
    entered_password = data.get("password")
    if not entered_email or not entered_password:      #if empty data received
        return jsonify({ "error": "Email and Password required." }), 400 #Bad request

    user = User.query.filter_by(email=entered_email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    #check against hashed pw to verify login
    if not verify_pass(user.password, entered_password):
        return jsonify({"error": "Invalid password."}), 401

    access_token = create_access_token(
        identity=str(user.user_id), expires_delta=timedelta(days=7), additional_claims={ "role": user.role.role_name })

    #setting up persistent cookie for login
    response = make_response(jsonify({"message": "Login successful",}), 200)
    #JWT token will be stored in a secure browser cookie (HTTP only or local host)
    set_access_cookies(response, access_token, max_age=60*60*24*7)

    return response



@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    response.delete_cookie("access_token_cookie")

    return response

