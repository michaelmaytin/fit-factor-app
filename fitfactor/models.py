from flask_sqlalchemy import SQLAlchemy
from .extensions import db
from sqlalchemy import event, insert

# Roles Table for the RBAC
class Role(db.Model):
    __tablename__ = 'Role'
    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), unique=True, nullable=False)
    #for verfication
    def __repr__(self):
        return f"<Role {self.role_name!r}>"

# User Table
class User(db.Model):
    __tablename__ = 'User'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    height_ft = db.Column(db.Float)
    weight_lbs = db.Column(db.Float)
    goal = db.Column(db.String(200))

    #Links User to Roles
    role_id = db.Column(db.Integer, db.ForeignKey('Role.role_id', ondelete="SET NULL"))
    role = db.relationship('Role', backref='users')

    #Links User to One-to-Many relationship with the following tables:
    workouts = db.relationship('Workout', backref='user', cascade='all, delete')
    meals = db.relationship('Meal', backref='user', cascade='all, delete')
    progress_logs = db.relationship('Progress', backref='user', cascade='all, delete')


# Exercise Table
class Exercise(db.Model):
    __tablename__ = 'Exercise'
    exercise_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    equipment = db.Column(db.String(100))

    # Link to Workout
    workouts = db.relationship('Workout_To_Exercise', backref='exercise', cascade='all, delete')
    #for verification
    def __repr__(self):
        return f"<Exercise {self.name!r}>"
# Workout Table
class Workout(db.Model):
    __tablename__ = 'Workout'
    workout_id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    duration_mins = db.Column(db.Integer)
    type = db.Column(db.String(50))

    #Links to User
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id', ondelete='CASCADE'), nullable=False)

    #Exercise Relationship
    exercises = db.relationship('Workout_To_Exercise', backref='workout', cascade='all, delete')
    #for verifcation
    def __repr__(self):
        return f"<Workout {self.workout_id} on {self.date}>"
    def serialize(self):
        return {
            "id": self.workout_id,
            "date": self.date.isoformat(),
            "duration_mins": self.duration_mins,
            "type": self.type,
            "user_id": self.user_id
        }

#(Many-to-Many Relationship) Workout and Exercise
class Workout_To_Exercise(db.Model):
    __tablename__ = 'Workout_to_Exercise'
    exercise_id = db.Column(db.Integer, db.ForeignKey('Exercise.exercise_id'), primary_key=True, nullable=False)    # Links Exercise and Workout together
    workout_id = db.Column(db.Integer, db.ForeignKey('Workout.workout_id'), primary_key=True, nullable=False)       # Links Exercise and Workout together
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    weight_lbs = db.Column(db.Float)


#Meals Table
class Meal(db.Model):
    __tablename__ = 'Meal'
    meal_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)     # Links to User
    meal_time = db.Column(db.DateTime)
    calories = db.Column(db.Integer)
    protein_g = db.Column(db.Float)
    carbs_g = db.Column(db.Float)
    fats_g = db.Column(db.Float)
    notes = db.Column(db.Text)
    def __repr__(self):
        return f"<Meal {self.meal_id} for User {self.user_id}>"
    def serialize(self):
        return {
            "id":        self.meal_id,
            "user_id":   self.user_id,
            "meal_time": self.meal_time.isoformat() if self.meal_time else None,
            "calories":  self.calories,
            "protein_g": self.protein_g,
            "carbs_g":   self.carbs_g,
            "fats_g":    self.fats_g,
            "notes":     self.notes,
       }
# Foods Table
class Food(db.Model):
    __tablename__ = 'Food'
    food_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    calories = db.Column(db.Integer)
    protein_g = db.Column(db.Float)
    carbs_g = db.Column(db.Float)
    fats_g = db.Column(db.Float)
    def __repr__(self):
        return f"<Food {self.name!r}>"

#Progress Table
class Progress(db.Model):
    __tablename__ = 'Progress'
    progress_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)    # Links to User
    entry_date = db.Column(db.Date)
    weight_lbs = db.Column(db.Float)
    body_fat_percentage = db.Column(db.Float)
    notes = db.Column(db.Text)
    def __repr__(self):
        return f"<Progress {self.entry_date} for User {self.user_id}>"
    def serialize(self):
        return {
            "id":                self.progress_id,
            "user_id":           self.user_id,
            "entry_date":        self.entry_date.isoformat() if self.entry_date else None,
            "weight_lbs":        self.weight_lbs,
            "body_fat_percentage": self.body_fat_percentage,
            "notes":             self.notes,
        }

#this initializes roles upon startup
@event.listens_for(Role.__table__, "after_create")
def insert_default_roles(target, connection, **kw):
    connection.execute(
        insert(Role.__table__),
        [
            {"role_name": "User"},
            {"role_name": "Trainer"},
            {"role_name": "Admin"},
        ]
    )