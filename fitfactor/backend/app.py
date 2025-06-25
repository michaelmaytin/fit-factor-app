from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allow request from React frontend

users = {
    "test@example.com": {
        "password": "123456",
        "role": "admin"
    },
    "user@example.com": {
        "password": "password",
        "role": "user"
    }
}

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Received data:", data)
    email = data.get('email')
    password = data.get('password')

    user = users.get(email)
    if user and user['password'] == password:
        return jsonify({
            "message": "Login successful",
            "email": email,
            "role": user['role']
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print("Signup received:", data)

    if email in users:
        return jsonify({"message": "User already exists"}), 409

    users[email] = {
        "password": password,
        "role": "user"
    }

    print("Current users:", users)
    return jsonify({"message": "Signup successful"}), 201

@app.route('/ping')
def ping():
    return "pong", 200

if __name__ == '__main__':
    app.run(debug=True)