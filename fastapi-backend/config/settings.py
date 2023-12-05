from pydantic import BaseSettings

# the settings are loaded from the .env file    
class Settings(BaseSettings):
    class Config:
        env_file = "../.env"



