# Fit Factor App
This is a fitness tracking web application created in collaboration during the summer semester at Florida State University. The collaborators involved are as follows: Michael Maytin, Nathaniel Arteaga, Dua Ali, and Brooks Berry

Professor Sharanya Jayaraman will oversee this project


### Prerequisites
Before setting up the project, make sure you have:

- Python 3.12+ with `pip`
- Node.js 18+ (includes `npm`) - https://nodejs.org/
- Docker + Docker Compose



## Getting Started
Make sure you have the requirments
    pip install -r requirments.txt

once you ensure that your current environment works after setup, run:
    pipfreeze > requirements.lock
also use that if you make changes to  requirements.txt


### For Backend
Choose one of these approaches to get your local database up and running:

   # Option A: Native MySQL 
       1.Install MySQL Server from https://dev.mysql.com/downloads/mysql/
       2.Set up Root password
       3.Create database fit_factor
       4.Create .env file in fit_factor_app directory
       5.Configure .env to:
           FLASK_APP=fitfactor:create_app
           FLASK_ENV=development
           DATABASE_URL=mysql+pymysql://fitfactor_user:yourpass@127.0.0.1:3306/fit_factor
           SECRET_KEY=your_random_secret
       6.Run Migrations
           flask db upgrade
       7.Start Server
           flask run

   # Option B: Docker 
       1.Install Docker Desktop
       2.Start docker-compose.yml
           docker compose up -d
       3.Create .env file in fit_factor_app directory
       4.Configure .env
           FLASK_APP=fitfactor:create_app
           FLASK_ENV=development
           DATABASE_URL=mysql+pymysql://fitfactor_user:devpass@127.0.0.1:3307/fit_factor
           SECRET_KEY=your_random_secret
       5.Run Migration
           flask db upgrade
       6.Start server
           flask run
         - Flask will run at http://localhost:5000

   # to confirm if .env is being read properly
         run: flask shell
            >>>from flask import current_app
            >>>print(current_app.config["SECRET_KEY"])
            >>>print(current_app.config["SQLALCHEMY_DATABASE_URI"])
         Confirm these match what you entered as your key and URL
         run: exit()
   


### Making schema changes

1. Edit `fitfactor/models.py` (add columns, tables, etc.).
2. Run  
   ```bash
   flask db migrate -m "change you made"
   flask db upgrade


### For Front End
- follow README in fit-factor-app/frontend/
