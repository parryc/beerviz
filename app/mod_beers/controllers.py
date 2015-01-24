#!/usr/local/bin/python
# coding: utf-8
# Import flask dependencies
from flask import Blueprint, render_template
from app import db
from app.mod_beers.models import *
from app.mod_users.models import *
import json
import datetime

mod_beers = Blueprint('beers', __name__, url_prefix='/beers')

#
# Routes
#


@mod_beers.route('/', methods=['GET'])
def index():
    # there's only my beer at the moment. 
    beers = Beers.query.all()
    return render_template('beers/index.html',beers=beers)

@mod_beers.route('/init', methods=['GET'])
def init():
    # there's only my beer at the moment. 
    me = Users.query.get(1)
    filename = 'beer.json'
    f = open(filename,'r')
    beers = json.load(f)
    for beer in beers:
      beer_entry = Beers(
        brewery=beer['brewery'],
        name=beer['name'],
        abv=float(beer['abv']),
        rating=float(beer['rating']),
        style=beer['style'],
        country=beer['country'],
        drink_country=beer['drinkLocationCountry'],
        drink_city=beer['drinkLocationCity'],
        drink_datetime=datetime.datetime(beer['drinkYear'],beer['drinkMonth'],1),
        notes=beer['notes']
        )
      db.session.add(beer_entry)
      me.beers.append(beer_entry)
    db.session.commit()
      # print beer.brewery + ' ' + beer.name
    return render_template('beers/index.html',beers=beers)