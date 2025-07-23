# fitfactor/main/routes.py

from flask import Blueprint, request, jsonify, abort, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from fitfactor.extensions import db
from fitfactor.models import Role, Workout, Meal, Progress, User
from datetime import datetime

#helper function for convenience 
def api_response(status, payload=None, message=None):
    return jsonify({
        "status": status,
        "data": payload,
        "message": message
    }), status

api = Blueprint("api", __name__, url_prefix="/api")

#gets user roles
@api.route("/roles", methods=["GET"])
def get_roles():
    roles = [r.role_name for r in Role.query.order_by(Role.role_id).all()]
    return api_response(200, payload=roles)

#-----------Workouts----------------------------
#lists all stored workouts in database and returns searlizes JSON
@api.route("/workouts", methods=["GET"])
def list_workouts():
    workouts = Workout.query.order_by(Workout.workout_id).all()
    serialized_workouts = [work.serialize() for work in workouts]
    return api_response(200, payload=serialized_workouts)

#creates a JSON file with date, user_id, druations_mins, and type
@api.route("/workouts", methods=["POST"])
def create_workout():
    data = request.get_json() or {}
    required_fields = ["date", "user_id"]
    missing_fields = [f for f in required_fields if not data.get(f)]
    
    if missing_fields:
        return api_response(
            400, payload={"missing_fields": missing_fields},
            message=f"Missing required fields: {', '.join(missing_fields)}."
        )
    try:
        date_obj = datetime.fromisoformat(data["date"]).date()
    except (KeyError, ValueError):
        return api_response(
            400,
            message="`date` must be a valid  date in format (YYYY-MM-DD)"
        )    
    work = Workout(
        date=date_obj,
        duration_mins=data.get("duration_mins"),
        type=data.get("type"),
        user_id=data["user_id"]
    )
    db.session.add(work)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(201, payload={"id": work.workout_id}, message="Workout created.")

#retrieves workout by ID
@api.route("/workouts/<int:workout_id>", methods=["GET"])
def get_workout(workout_id):
    work = Workout.query.get_or_404(workout_id)
    return api_response(200, payload=work.serialize(), message="Workout retrieved")
    
#updates workout by ID   
@api.route("/workouts/<int:workout_id>", methods=["PUT"])
def update_workout(workout_id):
        work = Workout.query.get_or_404(workout_id)
        data = request.get_json() or {}
        if "date" in data:
            try:
                work.date = datetime.fromisoformat(data["date"]).date()
            except ValueError:
                return api_response(
                400, message="`date` must be a valid ISO date (YYYY-MM-DD)")
        if "duration_mins" in data:
            work.duration_mins = data["duration_mins"]
        if "type" in data:
            work.type = data["type"]
        try:
            db.session.commit()
            return api_response(200, message="Workout updated")
        except Exception:
            db.session.rollback()
            return api_response(500, message="Database error")

#deletes workout by Id
@api.route("/workouts/<int:workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    work = Workout.query.get_or_404(workout_id)
    db.session.delete(work)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(200, message="Workout deleted")

# ------------Meals-----------------

#list meals
@api.route("/meals", methods=["GET"])
def list_meals():
    meals = Meal.query.all()
    return api_response(200, payload=[m.serialize() for m in meals])

#creates new meal entry with JSON
@api.route("/meals", methods=["POST"])
def create_meal():
    data = request.get_json()
    # assume everything’s there
    required = ["user_id", "meal_time"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return api_response(
            400, payload={"missing_fields": missing},
            message=f"Missing required fields: {', '.join(missing)}."
        )
    try:
        meal_time = datetime.fromisoformat(data["meal_time"])
    except ValueError:
         return api_response(
            400,
            message="`meal_time` must be a valid ISO8601 datetime (e.g. 2025-07-10T12:00:00)"
        )
    meal = Meal(user_id=data["user_id"], meal_time=meal_time,
        calories=data.get("calories"), protein_g=data.get("protein_g"),
        carbs_g=data.get("carbs_g"), fats_g=data.get("fats_g"),
        notes=data.get("notes"))
    db.session.add(meal); 
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(201, payload={"id":meal.meal_id})

#retrieves single meal by ID
@api.route("/meals/<int:meal_id>", methods=["GET"])
def get_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    return api_response(200, payload=meal.serialize())

#updates fields of existing meals
@api.route("/meals/<int:meal_id>", methods=["PUT"])
def update_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    data = request.get_json()
    if "meal_time" in data:
        try:
           meal.meal_time = datetime.fromisoformat(data["meal_time"])
        except ValueError:
           return api_response(400, message="`meal_time` must be ISO8601 datetime")
    if "calories" in data: meal.calories = data["calories"]
    if "notes" in data: meal.notes = data["notes"]
    try:
       db.session.commit()
    except Exception:
      db.session.rollback()
      return api_response(500, message="Database error")
    return api_response(200, payload=meal.serialize(), message="Meal updated")

#deletes meals
@api.route("/meals/<int:meal_id>", methods=["DELETE"])
def delete_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    db.session.delete(meal)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(200, message="Meal deleted")

# --------------Progress-------------------

#list out progress logs
@api.route("/progress", methods=["GET"])
def list_progress():
    prog = Progress.query.all()
    return api_response(200, payload=[p.serialize() for p in prog])

#creates new log
@api.route("/progress", methods=["POST"])
def create_progress():
    data = request.get_json()
    required = ["user_id", "entry_date"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return api_response(
            400, payload={"missing_fields": missing},
            message=f"Missing required fields: {', '.join(missing)}."
        )
    try:
        entry_data = datetime.fromisoformat(data["entry_date"]).date()
    except ValueError:
          return api_response(
            400,
            message="`entry_date` must be a valid date in YYYY-MM-DD format"
        )
    prog = Progress(user_id=data["user_id"], entry_date=entry_data,
        weight_lbs=data.get("weight_lbs"),
        body_fat_percentage=data.get("body_fat_percentage"),
        notes=data.get("notes"))
    db.session.add(prog)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(201, payload={"id":prog.progress_id})

#retrieves single log by ID
@api.route("/progress/<int:progress_id>", methods=["GET"])
def get_progress(progress_id):
    prog = Progress.query.get_or_404(progress_id)
    return api_response(200, payload=prog.serialize())

#updates logs 
@api.route("/progress/<int:progress_id>", methods=["PUT"])
def update_progress(progress_id):
    prog = Progress.query.get_or_404(progress_id)
    data = request.get_json()
    if "entry_date" in data:
        try:
           prog.entry_date = datetime.fromisoformat(data["entry_date"]).date()
        except ValueError:
           return api_response(400, message="`entry_date` must be YYYY-MM-DD")
    if "weight_lbs" in data: prog.weight_lbs = data["weight_lbs"]
    try:
       db.session.commit()
    except Exception:
       db.session.rollback()
       return api_response(500, message="Database error")
    return api_response(200, payload=prog.serialize(), message="Progress updated")

#deletes logs
@api.route("/progress/<int:progress_id>", methods=["DELETE"])
def delete_progress(progress_id):
    prog = Progress.query.get_or_404(progress_id)
    db.session.delete(prog)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(200, message="Progress deleted")


@api.route("/users/me", methods=["GET"])
@jwt_required()
def get_this_user():
    print("GET /users/me hit") #message for backend debug

    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return api_response(404,  message=f"No user found")

    return api_response(200, payload={
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "age": user.age,
        "gender": user.gender,
        "height_ft":user.height_ft,
        "weight_lbs": user.weight_lbs,
        "goal": user.goal,
    }, message="User info retrieved")