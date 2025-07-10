#Seed default roles into the database, creates roles if they 
#do not exist, run script with python -m script.seed_roles


import os
from werkzeug.security import generate_password_hash
from fitfactor import create_app
from fitfactor.extensions import db
from fitfactor.models import Role, User

def roles():
    app = create_app()

    with app.app_context():
        # Defines the roles
        default_roles = ["User", "Trainer", "Admin"]

        for role_name in default_roles:
            existing_role = Role.query.filter_by(role_name=role_name).first()
            if existing_role:
                print(f"Role '{role_name}' already exists. Skipping...")
            else:
                db.session.add(Role(role_name=role_name))
                print(f"Role '{role_name}' created.")

        db.session.commit()
        print("Finished seeding roles.")

        # Retrieve admin credentials from environment or fallback defaults
        admin_email = os.getenv("SEED_ADMIN_EMAIL", "admin@example.com")
        admin_pw = os.getenv("SEED_ADMIN_PW", "adminpass")

        # Checks if admin exists already
        existing_admin = User.query.filter_by(email=admin_email).first()
        if existing_admin:
            print(f"Admin user with email '{admin_email}' already exists. No new user created.")
        else:
            admin_role = Role.query.filter_by(role_name="Admin").first()
            if not admin_role:
                print("Admin role missing, cannot create admin user.")
                return

            admin_user = User(
                username="admin",
                email=admin_email,
                password=generate_password_hash(admin_pw),
                role=admin_role
            )
            db.session.add(admin_user)
            db.session.commit()
            print(f"Admin account created successfully with email '{admin_email}'.")

if __name__ == "__main__":
    roles()
