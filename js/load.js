var compiledTemplate = Handlebars.templates['beerlist'];

colorscale.create([
        {'value':0, 'color':{'r':94,'g':83,'b':64}},
        {'value':2.5,'color':{'r':234,'g':186,'b':110}},
        {'value':5,'color':{'r':110,'g':176,'b':234}}
        ], "beer");


colorscale.create([
        {'value':0, 'color':{'r':229,'g':224,'b':215}},
        {'value':5,'color':{'r':0,'g':0,'b':0}}
        ], "beer2");

//SRM value from
//http://www.twobeerdudes.com/beer/srm
//http://www.brewersfriend.com/2009/02/28/beer-styles-srm-color-chart/

colorscale.create([
  {'value':0, 'color':{r:0,g:0,b:0}},
  {'value':2, 'color':{r:255,g:255,b:69}},
  {'value':3, 'color':{r:255,g:233,b:62}},
  {'value':4, 'color':{r:254,g:216,b:73}},
  {'value':6, 'color':{r:255,g:168,b:70}},
  {'value':9, 'color':{r:244,g:159,b:68}}
  ], "SRM");

Handlebars.registerHelper('color', function(rating) {
  return colorscale.beer2.pick(rating);
});

Handlebars.registerHelper('rating-symbol', function(rating) {
  var parts = (""+rating).split('.');
  if(parts[0] === "0")
    return "☠";
  if(parts[0] === "1")
    return "⃠";
  if(parts[0] === "2")
    return "☆";
  if(parts[0] === "3")
    return "★";
  if(parts[0] === "4")
    return "♥";
});

Handlebars.registerHelper('twoDigitYear', function(year){
  return (""+year).substr(2);
});

Handlebars.registerHelper('wordRating', function(rating) {
  var parts = (""+rating).split('.');
  if(parts[1] === undefined)
    parts[1] = "0";
  parts[1] = Math.ceil(parts[1]);
  if(parts[0] === "0")
    return "Bad ("+parts[1]+")";
  if(parts[0] === "1")
    return "Meh ("+parts[1]+")";
  if(parts[0] === "2")
    return "Ok ("+parts[1]+")";
  if(parts[0] === "3")
    return "Good ("+parts[1]+")";
  if(parts[0] === "4")
    return "Great ("+parts[1]+")";
});
//No reason to load Moment.js for just one function call
// So uh... just steal from their docs! :D

Handlebars.registerHelper('date', function(drinkMonth, drinkYear){
  var months = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
  return months[parseInt(drinkMonth,10)-1]+", "+drinkYear;
});

Handlebars.registerHelper('month', function(drinkMonth){
  var months = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
  return months[parseInt(drinkMonth,10)-1];
});

Handlebars.registerHelper('banner', function(el){
  var months = "January_February_March_April_May_June_July_August_September_October_November_December".split("_");
  var parts = el.split('-');
  if(parts.length > 1)
    return months[parseInt(parts[1],10)-1]+", "+parts[0];
  else
    return el;
});


Handlebars.registerHelper('beerColor', function(style){
  return colorscale.SRM.pick(colorMap[style]);
});

var colorMap = {
  'Pale Lager':2,
  'Pilsener':3,
  'Hefeweizen':6.5
};



d3.json("beer.json", function(data) {
  window.beerlist = data;
  beer.init(data);
  groups = {};
  grouper = 'style';
  for (var el in beer.index[grouper]) {
    groups[el] = beer.lookup(beer.index[grouper][el]);
  }

  console.log(groups);

  document.getElementById('full-beer-list').innerHTML = compiledTemplate(groups);

  var fuzzyOptions = {
    searchClass: "fuzzy-search",
    location: 0,
    distance: 100,
    threshold: 0.4,
      multiSearch: true
  },
  options = {
    valueNames: [ 'name', 'brewery', 'rating', 'date', 'country', 'location-country', 'style' ],
    page: 2000
  },
  beerList = new List('beer-list-container', options);

  var beers = document.getElementsByClassName('beer');
  for (var i = beers.length - 1; i >= 0; i--) {
    beers[i].addEventListener('click', function(){
      console.log(this);
      this.getElementsByClassName('bottom')[0].classList.toggle('hidden');
    });
  }
});

