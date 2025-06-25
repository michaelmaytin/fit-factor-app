from flask import Flask
from .extensions import db, login_manager
from .models import User  

def create_app():
    app = Flask(__name__)

    @app.route("/ping")
    def ping():
        return "pong", 200

    # ── Config ──
    app.config['SECRET_KEY'] = 'supersecretkey'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fitfactor.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ── Init extensions ──
    db.init_app(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app
