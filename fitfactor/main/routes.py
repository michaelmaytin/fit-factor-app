# fitfactor/main/routes.py
#this file declares endpoints for the client

from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from fitfactor.security.rbac import roles_required
from flask import Blueprint, request, jsonify, abort, make_response
from fitfactor.extensions import db
from fitfactor.models import Role, Workout, Meal, Progress
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
@jwt_required()
@roles_required("Admin")
def get_roles():
    roles = [r.role_name for r in Role.query.order_by(Role.role_id).all()]
    return api_response(200, payload=roles)

#-----------Workouts----------------------------
#lists all stored workouts in database and returns searlized JSON

@api.route("/workouts", methods=["GET"])
@jwt_required()
def list_workouts():
    user_id = get_jwt_identity() #so the user only sees their own workout
    workouts = (Workout.query.filter_by(user_id=user_id).order_by(Workout.workout_id).all())
    return api_response(200, payload=[w.serialize() for w in workouts])

#creates a JSON file with date, user_id, druations_mins, and type
@api.route("/workouts", methods=["POST"])
@jwt_required()
def create_workout():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    required_fields = ["date"]
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
        user_id=user_id
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
@jwt_required()
def get_workout(workout_id):
    work = Workout.query.get_or_404(workout_id)
    claims = get_jwt()
    user_id = get_jwt_identity()
    if work.user_id != user_id and claims.get("role") not in ("Trainer","Admin"):
        abort(403)
    return api_response(200, payload=work.serialize(), message="Workout retrieved")
    
#updates workout by ID   
@api.route("/workouts/<int:workout_id>", methods=["PUT"])
@jwt_required()
def update_workout(workout_id):
        work = Workout.query.get_or_404(workout_id)
        if work.user_id != get_jwt_identity():
            abort(403)
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
@jwt_required()
def delete_workout(workout_id):
    work = Workout.query.get_or_404(workout_id)
    if work.user_id != get_jwt_identity():
        abort(403)
    db.session.delete(work)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(200, message="Workout deleted")

# ------------Meals-----------------
#retrieves meal with token
@api.route("/meals/<int:meal_id>", methods=["GET"])
@jwt_required()
def get_meal(meal_id):
    meal    = Meal.query.get_or_404(meal_id)
    user_id = get_jwt_identity()
    claims  = get_jwt()
    # allow admin or trainer to get workouts from ID
    if meal.user_id != user_id and claims.get("role") not in ("Trainer","Admin"):
        abort(403)
    return api_response(200, payload=meal.serialize())



#list meals
@api.route("/meals", methods=["GET"])
@jwt_required()
def list_meals():
    user_id = get_jwt_identity()
    meals = Meal.query.filter_by(user_id=user_id).all()
    return api_response(200, payload=[m.serialize() for m in meals])


#creates new meal entry with JSON
@api.route("/meals", methods=["POST"])
@jwt_required()
def create_meal():
    data = request.get_json()
    user_id = get_jwt_identity()
    required = ["meal_time"]
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
    meal = Meal(user_id=user_id, meal_time=meal_time,
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


#updates fields of existing meals
@api.route("/meals/<int:meal_id>", methods=["PUT"])
@jwt_required()
def update_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    if meal.user_id != get_jwt_identity():
        abort(403)
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
@jwt_required()
def delete_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    if meal.user_id != get_jwt_identity():
        abort(403)
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
@jwt_required()
def list_progress():
    user_id = get_jwt_identity()
    logs = Progress.query.filter_by(user_id=user_id).all()
    return api_response(200, payload=[p.serialize() for p in logs])


#creates new log
@api.route("/progress", methods=["POST"])
@jwt_required()
def create_progress():
    user_id = get_jwt_identity()
    data = request.get_json()
    required = ["entry_date"]
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
    prog = Progress(user_id=user_id, entry_date=entry_data,
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
@jwt_required()
def get_progress(progress_id):
    prog    = Progress.query.get_or_404(progress_id)
    user_id = get_jwt_identity()
    claims  = get_jwt()
    if prog.user_id != user_id and claims.get("role") not in ("Trainer","Admin"):
        abort(403)
    return api_response(200, payload=prog.serialize())


#updates logs 
@api.route("/progress/<int:progress_id>", methods=["PUT"])
@jwt_required()
def update_progress(progress_id):
    prog = Progress.query.get_or_404(progress_id)
    if prog.user_id != get_jwt_identity():
        abort(403)
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
@jwt_required()
def delete_progress(progress_id):
    prog = Progress.query.get_or_404(progress_id)
    if prog.user_id != get_jwt_identity():
        abort(403)
    db.session.delete(prog)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return api_response(500, message="Database error")
    return api_response(200, message="Progress deleted")