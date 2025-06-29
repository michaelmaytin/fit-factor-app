from flask import Flask, request, jsonify
from flask_cors import CORS
from extensions import db
from models import User, Role
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Shamcat!1234@localhost/fit_factor'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return jsonify({
            "message": "Login successful",
            "email": user.email,
            "role": user.role.role_name
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role_name = data.get('role')

    if not role_name:
        return jsonify({"message": "Role is required"}), 401

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    selected_role = Role.query.filter_by(role_name=role_name).first()
    if not selected_role:
        return jsonify({"message": "Invalid role selected"}), 400

    new_user = User(
        username=email.split('@')[0],
        email=email,
        password=generate_password_hash(password),
        role_id=selected_role.role_id
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201

@app.route('/ping')
def ping():
    return "pong", 200

if __name__ == '__main__':
    app.run(debug=True)
