# Use this for any third party libraries like sqlalchemy

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
#for schema history changes
migrate = Migrate()
