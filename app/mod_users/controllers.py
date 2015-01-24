#!/usr/local/bin/python
# coding: utf-8
# Import flask dependencies
from flask import Blueprint, render_template
from app import db
from app.mod_users.models import *

mod_users = Blueprint('users', __name__, url_prefix='/users')

#
# Routes
#


@mod_users.route('/', methods=['GET'])
def index():
    users = Users.query.all()
    return render_template('users/index.html',users=users)

@mod_users.route('/make', methods=['GET'])
def make():
    user_entry = Users(
      name='Parry',
      uses_full_drink_date=False)
    db.session.add(user_entry)
    db.session.commit()
    return render_template('users/index.html')

