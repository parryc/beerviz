// Create our Application
App = Ember.Application.create({});
$(document).ready(function(){
  $('body').append("Loading...");
  colorscale.set([
    {value: 0, color: "rgb(0,0,0)"},
    {value: 3, color: "rgb(255,0,0)"},
    {value: 6, color: "rgb(0,0,255)"},
    {value: 10, color: "rgb(0,255,0)"}
  ]);
});
// Our RedditLink model
App.Beer = Ember.Object.extend({
  color: function() {
    var rating = this.get('rating');
    return "color: "+colorscale.pick(+rating);
  }.property('rating'),
  search: function() {
    var brewery = this.get('brewery'),
        name = this.get('name'),
        rating = this.get('rating');
    return (brewery+" "+name+" "+rating).toLowerCase();
  }.property('brewery','name','rating')

});

App.Beer.reopenClass({
  findAll: function() {
    return $.getJSON('beer-5-13.json').then(function(response) {
      var beers = [];
      response.forEach(function(beer,index) {
        beers.push(App.Beer.create(beer));
      });
      // console.log(beers);
      return beers;
    });
  }

});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Beer.findAll();
  }
});

/*
  Text filter
*/

//Used for keyup delay.  From SO #1909441
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

App.Search = Em.TextField.extend({
    valueBinding: 'App.SearchValue.value',
    keyUp: function() {
      var search = App.SearchValue.get('value').toLowerCase();
      delay(function(){
        $('tbody tr').each(function(){
          if($(this).data('search').indexOf(search) === -1)
            $(this).hide();
          else
            $(this).show();
        });
      },200);
    }
});

App.SearchValue = Em.Object.create({
    value: ''
});


