// Create our Application
App = Ember.Application.create({});
$(document).ready(function(){
  $('body').append("Loading...");
  colorscale.set([
    {value: 0, color: "rgb(255,0,0)"},
    {value: 10, color: "rgb(0,255,0"}
  ]);
});
// Our RedditLink model
App.Beer = Ember.Object.extend({
  color: function() {
    var rating = this.get('rating');
    return "color: "+colorscale.pick(+rating);
  }.property('rating')

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
App.Search = Em.TextField.extend({
    valueBinding: 'App.SearchValue.value',
    keyUp: function() {
      var search = App.SearchValue.get('value');
      $('.name').each(function(){
        if($(this).text() !== search)
          $(this).parent().hide();
        else
          $(this).parent().show();
      });
    }
});

App.SearchValue = Em.Object.create({
    value: ''
});

App.SubmitButton = Em.Button.extend({
    click: function() {
        alert(App.TextValue.get('value'));
    }
});

