from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allow request from React frontend

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Dummy login logic
    if email == "test@example.com" and password == "123456":
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/ping')
def ping():
    return "pong", 200

if __name__ == '__main__':
    app.run(debug=True)