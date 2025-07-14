# fitfactor/main/routes.py

from flask import Blueprint, request, jsonify
from fitfactor.extensions import db
from fitfactor.models import Role, Workout

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
            400,
            payload={"missing_fields": missing_fields},
            message=f"Missing required fields: {', '.join(missing_fields)}."
        )
        
    work = Workout(
        date=data["date"],
        duration_mins=data.get("duration_mins"),
        type=data.get("type"),
        user_id=data["user_id"]
    )
    db.session.add(work)
    db.session.commit()
    return api_response(201, payload={"id": work.workout_id}, message="Workout created.")

#retrieves workout by ID
@api.route("/workouts/<int:workout_id>", methods=["GET"])
def get_workout(workout_id):
    work = Workout.query.get_or_404(workout_id)
    return api_response(200, payload=work.serialize(), message="Workout retrieved")
    
#updates workout by ID   
@api.route("/workouts/<int:workout_id>", methods=["PUT"])
def update_workout(workout_id):
    try: 
        work = Workout.query.get_or_404(workout_id)
        data = request.get_json() or {}
        if "date" in data:
            work.date = data["date"]
        if "duration_mins" in data:
            work.duration_mins = data["duration_mins"]
        if "type" in data:
            work.type = data["type"]
        db.session.commit()
        return api_response(200, message="Workout updated")
    except Exception as e:
        db.session.rollback()
        return api_response(500, message="Error occured while trying to update workout")

#deletes workout by Id
@api.route("/workouts/<int:workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    work = Workout.query.get_or_404(workout_id)
    db.session.delete(work)
    db.session.commit()
    return api_response(200, message="Workout deleted")
