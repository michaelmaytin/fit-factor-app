from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# initializing SQLAlchemy
db = SQLAlchemy()

# initialize Login Manager?
login_manager = LoginManager()
login_manager.login_view = 'auth.login' 
# Use this for any third party libraries like sqlalchemy
