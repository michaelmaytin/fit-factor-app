#settings for flask app, environment variables go here
# create your own .env file in order to test environment variables

class Config:
    secret_key = 'supsecretkey'  
    sql_alchemy_database_uri = 'sqlite:///fitfactor.db'
    sql_alchemy_track_modifications = False
