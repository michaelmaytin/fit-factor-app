#settings for flask app, environment variables go here
# create your own .env file in order to test environment variables
import os

class Config:
    #gets enviromental variable if set if not goes to local MYSQL URL
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://user:pass@localhost/fitfactor"
    )
    #disables SQLAlchemy's event notifcation system
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")