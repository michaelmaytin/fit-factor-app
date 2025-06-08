DROP DATABASE fit_factor;
CREATE DATABASE fit_factor;
USE fit_factor;

CREATE TABLE Users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(10),
    height_ft FLOAT,
    weight_lbs FLOAT,
    goal VARCHAR(100)
);	

CREATE TABLE Exercises (
	exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    equipment_needed VARCHAR(100)
);

CREATE TABLE Workouts (
	workout_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workout_date DATE NOT NULL,
    duration_minutes INT,
    workout_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Workout_to_Exercises (
	workout_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT,
    reps INT,
    weight_lbs FLOAT,
    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES Workouts(workout_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercises(exercise_id)
);

CREATE TABLE Nutrition (
	meal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_time DATETIME NOT NULL,
    calories INT,
    protein_g FLOAT,
    carbs_g FLOAT,
    fats_g FLOAT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Foods (
	food_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    calories INT,
    protein_g FLOAT,
    fats_g FLOAT,
    carbs_g FLOAT
);

CREATE TABLE Progress (
	progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    weight_lbs FLOAT,
    body_fat_percentage FLOAT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
