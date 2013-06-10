// Create our Application
App = Ember.Application.create({});
$(document).ready(function(){
  $('body').append("Loading...");
});
// Our RedditLink model
App.Beer = Ember.Object.extend({

  /*
    It seems reddit will return the string 'default' when there's no thumbnail present.
    This computed property will convert 'default' to null to avoid rendering a broken
    image link.
  */
  thumbnailUrl: function() {
    var thumbnail = this.get('thumbnail');
    return (thumbnail === 'default') ? null : thumbnail;
  }.property('thumbnail')

});

App.Beer.reopenClass({

  /* Use the Reddit JSON API to retrieve a list of links within a subreddit. Returns
     a promise that will resolve to an array of `App.Beer` objects */
  findAll: function() {
    return $.getJSON('beer-5-13.json').then(function(response) {
      var links = [];
      response.forEach(function(beer,index) {
        links.push(App.Beer.create(beer));
      });
      // console.log(links);
      return links;
    });
  }

});

// Our default route. Just show a list of the links in /r/aww
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
    insertNewline: function() {
        alert('Submitted: ' + App.SearchValue.get('value'));
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

