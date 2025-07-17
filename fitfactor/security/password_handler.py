#### password_handler.py ####

#this file implements the following:
  # hashing algorithm for password encryption
        #should use a library for this
        #bcrypt or scrypt?
        #add salt (salt n hash) to prevent vulnerabilities
  # password verification
#########################################
#keep all hashing logic in here. easier to refactor if changing hash algorithm



from werkzeug.security import generate_password_hash, check_password_hash

def hash_pass(unhashed_pw):
    return generate_password_hash(unhashed_pw)
    #werkzeug security uses scrypt


def verify_pass(hashed_pw, entered_pw):
    return check_password_hash(hashed_pw, entered_pw)