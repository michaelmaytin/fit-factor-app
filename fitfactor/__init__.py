# fitfactor/__init__.py

import os
from dotenv import load_dotenv
from flask import Flask

# Load environment variables from the project root’s .env
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '..', '.env'))

from .config import Config
from .extensions import db, migrate
from .main.routes import api as api_bp
from .main import bp as main_bp  #main Blueprint

def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    return app
