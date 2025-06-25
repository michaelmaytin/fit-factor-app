from flask import Blueprint

bp = Blueprint('main', __name__, url_prefix='/api')

@bp.route('/ping', methods=['GET'])
def ping():
    return {'status': 'ok'}, 200
