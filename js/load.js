var compiledTemplate = Handlebars.templates['beerlist'];

colorscale.create([
        {'value':0, 'color':{'r':94,'g':83,'b':64}},
        {'value':2.5,'color':{'r':234,'g':186,'b':110}},
        {'value':5,'color':{'r':110,'g':176,'b':234}}
        ], "beer");

Handlebars.registerHelper('color', function(rating) {
  return colorscale.beer.pick(rating);
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
Handlebars.registerHelper('date', function(drinkMonth, drinkYear){
  return moment(drinkMonth+"/"+"01/"+drinkYear).format('MMM, YYYY');
});



d3.json("beer.json", function(data) {
  $('#full-beer-list').html(compiledTemplate(data));

  var fuzzyOptions = {
    searchClass: "fuzzy-search",
    location: 0,
    distance: 100,
    threshold: 0.4,
      multiSearch: true
  },
  options = {
    valueNames: [ 'name', 'brewery', 'rating', 'date', 'country', 'location' ],
    page: 1000
  },
  beerList = new List('beer-list-container', options);

});