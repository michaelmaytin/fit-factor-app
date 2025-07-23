# fitfactor/__init__.py

import os
from dotenv import load_dotenv
from flask import Flask

# Load environment variables from the project root’s .env
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '..', '.env'))

from fitfactor.config import Config
from fitfactor.extensions import db, migrate
from fitfactor.main.routes import api as api_bp
from fitfactor.main import bp as main_bp  #main Blueprint
from fitfactor.security.authentication_routes import auth_bp
from . import models #required for Flask-Migrate to detect models
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask import jsonify

jwt = JWTManager()

def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"
    app.config["JWT_COOKIE_SECURE"] = False  # False for local development over HTTP(set to true for CSRF protection. This would require adding config headers to the routes)
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # Can enable later if needed
    app.config["JWT_COOKIE_HTTPONLY"] = True
    app.config["JWT_COOKIE_SAMESITE"] = "LAX" #allows dev and prevents CSRF (cross site request forgery attack)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])


    # Initialize Flask extensions
    jwt.init_app(app)
    @jwt.invalid_token_loader
    def custom_invalid_token(reason):   #ai generated for debugging purposes
        print("JWT INVALID:", reason)
        return jsonify({"msg": "Invalid token", "reason": reason}), 422

    @jwt.unauthorized_loader    #ai generated for debugging purposes
    def custom_unauthorized(reason):
        print("JWT MISSING:", reason)
        return jsonify({"msg": "Missing token", "reason": reason}), 401


    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints for flask routes
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)
    return app
