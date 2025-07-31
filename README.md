# Fit Factor App
___
# OVERVIEW:
This is a fitness tracking web application created in collaboration during the summer semester at Florida State University. The collaborators involved are as follows: Michael Maytin, Nathaniel Arteaga, Dua Ali, and Brooks Berry. We are trying to create an app that logs all your meals, workouts, and notes.

Professor Sharanya Jayaraman will oversee this project

___
# DISCLAIMER FOR RUNNING THE APP:
when using CRUD functionality in our app, the data persists, however currently you must refresh and log back in to see changes

___
# SEPARATION OF PARTS:

Team member	Primary responsibilities
Michael Maytin	Database schema design, SQLAlchemy models, initial Docker setup.
Nathaniel Arteaga	JWT auth flow, RBAC decorators, workout/meal/progress endpoints, README authoring.
Dua Ali	React UI/UX, form validation, token refresh logic, Bootstrap theming.
Brooks Berry	Trainer dashboard, charting components, integration tests (Testing-Library),Login, Log out, Secure cookie transfer of JWT tokens, Frontend crud/data persistence


____
#Libraries used
Backend (requirements.txt)
Flask · Flask-JWT-Extended · Flask-Login · Flask-Migrate · Flask-SQLAlchemy · SQLAlchemy · PyMySQL · python-dotenv · cryptography · alembic · cffi · blinker · click · colorama · greenlet · itsdangerous · Jinja2 · Mako · MarkupSafe · PyJWT · typing-extensions · Werkzeug

Frontend (package.json)
React · React-DOM · React Router DOM v7 · Axios · Bootstrap 5 · React-Bootstrap · Web Vitals · Testing-Library (DOM/React/Jest-DOM/User-Event)

____
#Other Resources
Icons & Logo – Generated with Picsart AI Logo Generator (see frontend/README.md).
Docker images – Official python:3.12-slim, node:18-alpine, mysql:8 on Docker Hub.
Schema design notes – notes/database.txt (evolution history and ER diagram link).
Security playbook – notes/Security.txt documents password hashing, JWT flow, and RBAC plan.
Deployment cheatsheet – notes/Deployment.txt outlines Azure / AWS container guidance.

___
#SET UP
## Prerequisites
Before setting up the project, make sure you have:
- Python 3.12+ (for backend api)
- Node.js 18+ (for frontend. includes `npm`) 
- Docker + Docker Compose (database MYSQL)

___
## For Backend

Make sure you have the requirements
- pip install -r requirments.txt \
If you make changes to  requirements.txt, run:
- pipfreeze > requirements.lock



Choose one of these approaches to get your local database up and running:

   ### Option A: Native MySQL 
       1.Install MySQL Server from https://dev.mysql.com/downloads/mysql/
       2.Set up Root password
       3.Create database fit_factor
       4.Create .env file in fit_factor_app directory
       5.Configure .env to:
            FLASK_APP=fitfactor:create_app
            FLASK_ENV=development
            DATABASE_URL=mysql+pymysql://fitfactor_user:yourpass@127.0.0.1:3306/fit_factor
            SECRET_KEY=your_random_secret
            PYTHONPATH=.
       6.Run Migrations
           flask db upgrade
       7.Start Server
           flask run

   ### Option B: Docker 
       1.Install Docker Desktop
       2.Start docker-compose.yml
           docker compose up -d
       3.Create .env file in fit_factor_app directory
       4.Configure .env
            FLASK_APP=fitfactor:create_app
            FLASK_ENV=development
            DATABASE_URL=mysql+pymysql://fitfactor_user:devpass@127.0.0.1:3307/fit_factor
            SECRET_KEY=your_random_secret
            PYTHONPATH=.
       5.Run Migration
           flask db upgrade
       6.Start server
           flask run
         - Flask will run at http://localhost:5000


 ### To verify environment variables
1. run: flask shell
            >>>from flask import current_app
            >>>print(current_app.config["SECRET_KEY"])
            >>>print(current_app.config["SQLALCHEMY_DATABASE_URI"])
2. Confirm these match what you entered as your key and URL
         
3. run: exit()
   


## Making schema changes

1. Edit `fitfactor/models.py` (add columns, tables, etc.).
2. Run  
   ```bash
   flask db migrate -m "change you made"
   flask db upgrade

## RBAC testing and development
1. Read seed_roles.py for details
2. Make sure db is up (docker compose up -d)
2. Run this script in a terminal from project root
'run_seed_roles_pstest.ps1'


## For Front End
1. see frontend/README.md for 'npm install' and 'npm start' instructions
