-- Drop and recreate the database
DROP DATABASE IF EXISTS fit_factor;
CREATE DATABASE fit_factor;
USE fit_factor;

-- Roles table
CREATE TABLE Role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- User table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(10),
    height_ft FLOAT,
    weight_lbs FLOAT,
    goal VARCHAR(200),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE SET NULL
);

-- Exercise table
CREATE TABLE Exercise (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    equipment VARCHAR(100)
);

-- Workout table
CREATE TABLE Workout (
    workout_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    duration_mins INT,
    `type` VARCHAR(50),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Workout_to_Exercises (many-to-many relationship)
CREATE TABLE Workout_to_Exercise (
    workout_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT,
    reps INT,
    weight_lbs FLOAT,
    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES Workout(workout_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id) ON DELETE CASCADE
);

-- Meals table
CREATE TABLE Meal (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_time DATETIME,
    calories INT,
    protein_g FLOAT,
    carbs_g FLOAT,
    fats_g FLOAT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Foods table
CREATE TABLE Food (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    calories INT,
    protein_g FLOAT,
    carbs_g FLOAT,
    fats_g FLOAT
);

-- Progress table
CREATE TABLE Progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE,
    weight_lbs FLOAT,
    body_fat_percentage FLOAT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);
