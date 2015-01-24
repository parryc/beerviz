import os

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'do-you-like-beer'
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/beer'


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True


# print os.environ['APP_SETTINGS']
# print os.environ['DATABASE_URL']
