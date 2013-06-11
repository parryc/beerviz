# Beer

I like beer.  You like beer.  We all like beer.  Or at least a fair amount of us do. 

# Data

I like data.  You like data... ok actually, this one might be a stretch. But if you do, have I got a web app for you. 

# So what is this?

This is a little app to visualize all of the glorious beer data I have collected.  You can use it too!

# Let's get started.
## What is it at the moment?

Currently this is not a full stack application.  It's *almost* a full stack application.  There is a Node.js backend that can add and edit beers and there is an Ember.js frontend that reads data from a JSON file.

## Installation

Node backend

* Install [Node.js](nodejs.org/‎)
* Install [MongoDB](www.mongodb.org/‎)
* Download the source code and run `npm install` in the node directory
* `node app.js` to start the server
* Navigate to `localhost:8332/add` to add and `localhost:8332/edit` (they're contentEditable divs) 
* Export: `mongoexport --jsonArray --db beerviz --collection beers --out beer.json --journal`

Ember.js Frontend

* Make sure you have the `beer.json` file in there and just go to `index.html`

## THE FUTURE

* ALL OF THE D3. SO MUCH I'LL BE USING D4.
* ALSO, MORE BEER.
* More mobile friendly
* Full stack? 

## License

[MIT](http://parryc.mit-license.org/)