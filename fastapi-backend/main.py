from config.settings import Settings
from functools import lru_cache

@lru_cache()
def getSettings():
    return Settings()

# clear the cache, if needed (e.g. when the .env file is changed)
def clearCache():
    try:
        getSettings.cache_clear()
        return True
    except Exception as e:
        print(e)
        return False
