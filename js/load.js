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

Handlebars.registerHelper('color', function(rating) {
  return colorscale.beer2.pick(rating);
});

Handlebars.registerHelper('rating2', function(rating) {
  var parts = (""+rating).split('.');
  if(parts[0] === "0")
    return "bad";
  if(parts[0] === "1")
    return "meh";
  if(parts[0] === "2")
    return "ok";
  if(parts[0] === "3")
    return "good";
  if(parts[0] === "4")
    return "great";
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



d3.json("beer.json", function(data) {
  window.beerlist = data;
  document.getElementById('full-beer-list').innerHTML = compiledTemplate(data);

  var fuzzyOptions = {
    searchClass: "fuzzy-search",
    location: 0,
    distance: 100,
    threshold: 0.4,
      multiSearch: true
  },
  options = {
    valueNames: [ 'name', 'brewery', 'rating', 'date', 'country', 'location-country', 'style' ],
    page: 10
  },
  beerList = new List('beer-list-container', options);
});