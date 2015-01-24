from app import db
from datetime import datetime

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text())
    uses_full_drink_date = db.Column(db.Boolean())
    beers = db.relationship('Beers', backref='users', lazy='joined')
    creation_datetime = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime)

    def __init__(self, name, uses_full_drink_date, creation_datetime=None, last_updated=None):
        self.name = name
        self.uses_full_drink_date = uses_full_drink_date
        if creation_datetime is None:
            creation_datetime = datetime.utcnow()
        if last_updated is None:
            last_updated = datetime.utcnow()
        self.creation_datetime = creation_datetime
        self.last_updated = last_updated

    def __repr__(self):
        return '<User %s>' % (self.name)