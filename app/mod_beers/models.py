from app import db
from datetime import datetime

class Beers(db.Model):
    __tablename__ = 'beers'

    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('users.id'))
    brewery = db.Column(db.Text())
    name = db.Column(db.Text())
    abv = db.Column(db.Float())
    rating = db.Column(db.Float())
    # probably should be foreign key with a style table
    #db.Column(db.Integer, db.ForeignKey('styles.id'))
    style = db.Column(db.Text())
    # probably should be foreign key with a country table
    country = db.Column(db.Text())
    drink_country = db.Column(db.Text())
    drink_city = db.Column(db.Text())
    # will have flag in user preference to store real time or just month/year
    drink_datetime = db.Column(db.DateTime)
    notes = db.Column(db.Text())
    creation_datetime = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime)

    def __init__(self, brewery, name, abv, rating, style, country, drink_country, drink_city, drink_datetime, notes='', creation_datetime=None, last_updated=None):
        self.brewery = brewery
        self.name = name
        self.abv = abv
        self.rating = rating
        self.style = style
        self.country = country
        self.drink_country = drink_country
        self.drink_city = drink_city
        self.drink_datetime = drink_datetime
        self.notes = notes
        if creation_datetime is None:
            creation_datetime = datetime.utcnow()
        if last_updated is None:
            last_updated = datetime.utcnow()
        self.creation_datetime = creation_datetime
        self.last_updated = last_updated

    def __repr__(self):
        return '<%s %s  - %s>' % (self.brewery, self.name, self.user.name)