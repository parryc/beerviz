// Create our Application
App = Ember.Application.create({});

$(document).ready(function(){
  colorscale.set([
    {value: 0, color: "rgb(0,0,0)"},
    {value: 5.5, color: "rgb(255,0,0)"},
    {value: 6.5, color: "rgb(0,0,255)"},
    {value: 10, color: "rgb(0,255,0)"}
  ]);
});

App.IndexController = Ember.ArrayController.extend({
  averageRating: function () {
    var beers = this.get('model'),
        total = 0;
    $.each(beers,function(){
      beer = $(this)[0];
      total += +beer.rating;
    });
    return (total/beers.length).toFixed(2);
  }.property('model'),
  breweriesCount: function () {
    var beers = this.get('model');
    return getUniqueByParam('brewery',beers).length;
  }.property('model'),
  brewsCount: function () {
    var beers = this.get('model');
    return beers.length;
  }.property('model'),
  countriesCount: function () {
    var beers = this.get('model');
    return getUniqueByParam('country',beers).length;
  }.property('model'),
  stylesCount: function () {
    var beers = this.get('model');
    return getUniqueByParam('style',beers).length;
  }.property('model')
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Beer.findAll();
  }
});

App.IndexView = Ember.View.extend({
  didInsertElement: function() {
    $('.tablesorter').tablesorter({
      sortList: [[0,1]]
    });
  }
});

App.Beer = Ember.Object.extend({
  color: function() {
    var rating = this.get('rating');
    return "color: "+colorscale.pick(+rating);
  }.property('rating'),
  date: function() {
    var month = +this.get('drinkMonth'),
        year = +this.get('drinkYear');

    return year+"-"+month;
  }.property('drinkMonth','drinkYear'),
  month: function() {
    return +this.get('drinkMonth');
  }.property('drinkMonth'),
  search: function() {
    var brewery = this.get('brewery'),
        name = this.get('name'),
        rating = this.get('rating'),
        style = this.get('style');
    return (brewery+" "+name+" "+style+" "+rating).toLowerCase();
  }.property('brewery','name','style','rating'),
  year: function() {
    return +this.get('drinkYear');
  }.property('drinkYear')

});

App.Beer.reopenClass({
  findAll: function() {
    return $.getJSON('beer.json').then(function(response) {
      var beers = [];
      response.forEach(function(beer,index) {
        beers.push(App.Beer.create(beer));
      });
      //console.log(beers);
      return beers;
    });
  }

});

/*
  Text filter
*/

App.Search = Em.TextField.extend({
    valueBinding: 'App.SearchValue.value',
    placeholder: 'Search',
    keyUp: function() {
      var search = App.SearchValue.get('value').toLowerCase();
      delay(function(){
        var totalRating = 0,
            totalBrews = [],
            tempBrew = "",
            totalBreweries = [],
            tempBrewery = "",
            totalStyles = [],
            tempStyle = "",
            count = 0;

        $('tbody tr').each(function(){
          if($(this).data('search').indexOf(search) === -1)
            $(this).hide();
          else {
            $(this).show();
            tempBrew = $(this).find('.name').text();
            tempBrewery = $(this).find('.brewery').text();
            tempStyle = $(this).find('.style').text();

            if($.inArray(tempBrew,totalBrews) === -1)
              totalBrews.push(tempBrew);
            if($.inArray(tempBrewery,totalBreweries) === -1)
              totalBreweries.push(tempBrewery);
            if($.inArray(tempStyle,totalStyles) === -1)
              totalStyles.push(tempStyle);

            totalRating += +$(this).find('.rating').text();
            count++;
          }
        });
        $('#average').text((totalRating/count).toFixed(2));
        $('#total-breweries').text(totalBreweries.length);
        if(search)
          $('#total-brews').text(totalBrews.length);
        else
          $('#total-brews').text($('tbody tr').length);
        $('#total-styles').text(totalStyles.length);
      },200);
    }
});

App.SearchValue = Em.Object.create({
    value: ''
});


/**********
Utility functions
**********/

/*
param: the name of the property
json: the data you want to analyze (json formatted)

counts the number of objects in the json structure that have a certain property
*/

function countByParam(param,json){
  var counts = [],
      add = {};
  for (var i = json.length - 1; i >= 0; i--) {
    var found = findProp(counts,param,json[i][param]);
    //console.log(json[i][param]);
    if(typeof found[0] !== 'undefined' && found[0] !== null)
      found[0].count++;
    else {
      add = {};
      add[param] = json[i][param];
      add.count = 1;
      counts.push(add);
    }
  }
  return counts;
}

function getUniqueByParam(param,json){
  var uniqueList = [];
  for (var i = json.length - 1; i >= 0; i--) {
    if($.inArray(json[i][param],uniqueList) === -1)
      uniqueList.push(json[i][param]);
  }
  return uniqueList;
}

/*
find all properties in a list of objects that meet a certain parameter
*/

function findProp(list, property, name){
  return $.grep(list, function(item){
    return item[property] == name;
  });
}

//Used for keyup delay.  From SO #1909441
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();


