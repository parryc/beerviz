/************
Server setup!
*************/
var express = require('express');
var app = express(),
	http = require('http'),
	server = http.createServer(app),
	jade = require('jade'),
	mongoose = require('mongoose'),
	huntsman = require('huntsman'),
	ba = require('./beer-advocate-api.js');

var spider = huntsman.spider({
  throttle: 5
});
spider.extensions = [
  huntsman.extension('cheerio')
];


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});


/********************
DEFINING THE DATABASE FOR GREAT SUCCESS!!
********************/
mongoose.connect('mongodb://localhost:27017/beerviz', function(err){
	if (err)
		console.log("Error, Will Robinson, Error!: "+err);
});

Schema = mongoose.Schema;
ObjectId = mongoose.Types.ObjectId;

var beerSchema = new Schema({
	brewery: String,
	name: String,
	style: String,
	country: String,
	rating: Number,
	notes: String,
	drinkLocationCity: String,
	drinkLocationCountry: String,
	drinkMonth: Number,
	drinkYear: Number,
	abv: Number
});

var Beer = mongoose.model('Beer',beerSchema);

/********************
Application, bitches!
********************/


/********************
Display
********************/
app.get('/', function(req, res) {
	Beer.find({}).sort({_id:-1}).limit(5).exec(function(err,beers){
		if(err)
			console.log(err);
		res.render('beer.jade', {recent: beers});
	});
});

app.get('/breweries', function(req, res){

});

/*********************
Future API helpers?
*********************/

app.get('/data/:type/:sort?',function(req, res){
	var sort = {};
	if(req.params.sort)
		sort[req.params.sort] = 1;
	Beer.find({}).sort(sort).exec(function(err,beers){
		if(req.params.type.toLowerCase() === "json")
			res.send(beers);
		else
			res.send("Not implemented");
	});
});

app.get('/display/graph', function(req, res){
	res.render('graph.jade',{});
});

app.get('/display/:dataType/:chartType', function(req, res){
	res.render('chart.jade',{
		dataType: req.params.dataType,
		chartType: req.params.chartType,
		title: "Ratings",
		type: "Bar Chart",
		instructions: "Click on a bar to view specific data"
	});
});

/*
	Edit beer data
*/
app.get('/edit/:sort?',function(req, res){
	var sort = {};
	if(req.params.sort)
		sort[req.params.sort] = 1;
	Beer.find({}).sort(sort).exec(function(err,beers){
		//console.log(beers);
		res.render('edit.jade',{"beers":beers});
	});
});

app.post('/edit',express.bodyParser(),function(req, res){
	console.log(req.body);
	var split = req.body.id.split('_'),
		type = split[0],
		id = split[1],
		set = {};

	//TODO: Need to recast all the ratings/drinkMonth/drinkYear as numbers.
	set[type] = req.body.value;

	console.log(split);
	Beer.findOneAndUpdate({'_id': id},{$set: set},function(err, beer){
		console.log(beer);
		if(!err)
			res.send(req.body.value);
	});
});

/*
	Add beer data
*/

app.get('/add',function(req, res){
	res.render('add.jade',{});
});

app.post('/add',express.bodyParser(),function(req, res){
	var beer = new Beer({
		brewery: req.body.brewery,
		name: req.body.name,
		style: req.body.style,
		country: req.body.country,
		rating: req.body.rating,
		notes: req.body.notes,
		drinkLocationCity: req.body.drinkLocationCity,
		drinkLocationCountry: req.body.drinkLocationCountry,
		drinkMonth: req.body.drinkMonth,
		drinkYear: req.body.drinkYear,
		abv: req.body.abv
	});
	beer.save(function(err){
		if(err)
			console.log(err);
		else
			res.render('add.jade',{});
	});

});



/* 
 Star the crawl
*/

app.get('/crawl',function(req, res){
	Beer.find({}).exec(function(err,beers){
		var beer, topChoice, out = [];
		beers.forEach(function(beer, index, arr){
			ba.beerSearch(beer.brewery+" "+beer.name, function(baResponse){
				// console.log(baResponse);
				topChoice = baResponse[0];
				if(topChoice === undefined || !topChoice) {
					console.log('FAIL: ' + beer.brewery+" "+beer.name);
					out.push({
						'id':beer._id,
						'in_db':beer.brewery+" "+beer.name
					});
				} else {
					ba.beerPage(topChoice.beer_url, function(response){
						console.log((beers.length-index) + " beers left on the wall");
						// console.log(response);
						// console.log("Looked for: "+beer.brewery+" "+beer.name+" and got "+response[0].brewery_name+" "+response[0].beer_name+ "("+response.beer_abv+")");
						out.push({
							'id':beer._id,
							'in_db':beer.brewery+" "+beer.name,
							'res_name':response[0].brewery_name,
							'res_brwry':response[0].beer_name,
							'abv':response[0].beer_abv.replace('%','')
						});
						if(index === beers.length-1) {
							console.log(out);
							// console.log("sent");
							res.send(out);
						}
					});
				}
			}, false, true);
		});
	});
});

//SERVE THE SHIT!
if (!module.parent) {
	var port = 8332; //BEER.
	server.listen(port, function() {
		console.log("Listening on " + port);
	});
}




