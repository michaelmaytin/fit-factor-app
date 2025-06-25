from flask import Flask
from .config import Config
from .extensions import db, migrate
from .main import bp as main_bp
from .models     import (
    Role, User, Exercise, Workout, Workout_To_Exercise,
    Meal, Food, Progress
)

def create_app(config_class=Config):     
    app = Flask(__name__)
    app.config.from_object(config_class)     
    db.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(main_bp)
    
    return app
