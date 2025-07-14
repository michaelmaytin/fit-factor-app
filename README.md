# Fit Factor App
This is a fitness tracking web application created in collaboration during the summer semester at Florida State University. The collaborators involved are as follows: Michael Maytin, Nathaniel Arteaga, Dua Ali, and Brooks Berry

Professor Sharanya Jayaraman will oversee this project

## Getting Started
Make sure you have the requirments

pip install -r requirments.txt

For Backend
Choose one of these approaches to get your local database up and running:

### Option A: Native MySQL 
    1.Install MySQL Server from https://dev.mysql.com/downloads/mysql/
    2.Set up Root password
    3.Create database fit_factor
    4.Configure .env to:
        FLASK_APP=fitfactor:create_app
        FLASK_ENV=development
        DATABASE_URL=mysql+pymysql://fitfactor_user:yourpass@127.0.0.1:3306/fit_factor
        SECRET_KEY=your_random_secret
    5.Run Migrations
        flask db upgrade
    6.Start Server
        flask run

### Option B: Docker 
    1.Install Docker Desktop
    2.Start docker-compose.yml
        docker compose up -d
    3.Configure .env
        FLASK_APP=fitfactor:create_app
        FLASK_ENV=development
        DATABASE_URL=mysql+pymysql://fitfactor_user:devpass@127.0.0.1:3307/fit_factor
        SECRET_KEY=your_random_secret
    4.Run Migration
        flask db upgrade
    5.Start server
        flask run


### Making schema changes

1. Edit `fitfactor/models.py` (add columns, tables, etc.).
2. Run  
   ```bash
   flask db migrate -m "change you made"
   flask db upgrade
