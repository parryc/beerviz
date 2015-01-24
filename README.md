# Beer

I like beer.  You like beer.  We all like beer.  Or at least a fair amount of us do. 

# Data

I like data.  You like data... ok actually, this one might be a stretch. But if you do, have I got a web app for you. 

# So what is this?

This is a little app to visualize all of the glorious beer data I have collected.  You can use it too!

# Let's get started.
## What is it at the moment?

Currently this is not a full stack application.  It's *almost* a full stack application.  There is a Node.js backend that can add and edit beers and there are two front-facing pages for your beer elucidation: 

* The index page, which is a speedy, mobile-oriented (I use it at the grocery store), filterable, sortable list of all the beer I've ever had. 
* A stats page, which is still mostly a work in progress, which you can drill down and look at beers in more detail.

# Installation

# Version
````v1.0a````
Still in alpha - I cannot guarantee anything will work. Especially I rewrote this shit in Python.

# Follow along at home!

## Pre-requisites
* Postgres and associated command-line tools must be installed
* virtualenv must be installed


Activate Python virtual environment and install (you may need to delete ```.env/include/python2.7```)
````
cd /path/to/directory
virtualenv --no-site-packages --distribute .env && source .env/bin/activate && pip install -r requirements.txt
. .env/bin/activate
````

Setup database (after installing Postgres)

````
createdb beer
python manage.py db init
````
If migrations already exist, use ```python manage.py db upgrade``` instead of ```python manage.py db init```. 


## Database migration
````
python manage.py db migrate
python manage.py db upgrade
````


Webpages

* Just make sure you have a ```beer.json``` file in the main directory and you should be peachy keen. 

## THE FUTURE

* ALL OF THE D3. SO MUCH I'LL BE USING D4.
* ALSO, MORE BEER.
* More mobile friendly
* Full stack? 

## License

[MIT](http://parryc.mit-license.org/)