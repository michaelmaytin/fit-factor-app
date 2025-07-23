#### rbac.py ####

#this file implements the following:
    #Role based access and control decorators for security
        #role decorators go here for function routing

    #include classes for defining roles, permissions, and the relationships between them.
#########################################


# at minimum 3 RBAC controls:
# Users - who will be able to log and view calories, progress, and other personal data,
# Trainers - who will be able to view and manage their client's data, and
# Admins - who can oversee the system operations and handle user managements.

from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def roles_required(*allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in allowed_roles:
                return jsonify({ "error": "Forbidden" }), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
