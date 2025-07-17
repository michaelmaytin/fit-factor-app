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

jwt = JWTManager()

def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints for flask routes
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)
    return app
