from flask import Flask
from extensions import db
from models import Role

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Shamcat!1234@localhost/fit_factor'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

roles = ["user", "admin", "trainer"]

with app.app_context():
    for role_name in roles:
        existing_role = Role.query.filter_by(role_name=role_name).first()
        if not existing_role:
            new_role = Role(role_name=role_name)
            db.session.add(new_role)
            print(f"Inserted role: {new_role.role_name}")
    db.session.commit()
    print("Role insertion complete")