#### password_handler.py ####

#this file implements the following:
  # hashing algorithm for password encryption
        #should use a library for this
        #bcrypt or scrypt?
        #add salt (salt n hash) to prevent vulnerabilities
  # password verification
#########################################



from werkzeug.security import generate_password_hash

def hash_pass(password):
    return generate_password_hash(password)