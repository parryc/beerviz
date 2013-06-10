/************
Server setup!
*************/
var express = require('express');
var app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	jade = require('jade'),
	mongoose = require('mongoose');


//Reduce logging
io.set('log level',1);

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
	drinkYear: Number
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
		drinkYear: req.body.drinkYear
	});
	beer.save(function(err){
		if(err)
			console.log(err);
		else
			res.render('add.jade',{});
	});

});

//SERVE THE SHIT!
if (!module.parent) {
	var port = 8332; //BEER.
	server.listen(port, function() {
		console.log("Listening on " + port);
	});
}




