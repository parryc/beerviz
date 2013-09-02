/**
Page load
**/

$(document).ready(function(){
  colorscale.create([
        {'value':0,'color':{'r':238,'g':131,'b':103}},
        {'value':10,'color':{'r':130,'g':184,'b':64}}
        ], "beer");

  $('.tablesorter').tablesorter({sortList: [[0,0]]});
});

function BeerCtrl($scope, $http, $timeout) {
  var data = null, timeout = null, tempQuery;

  $scope.query = '';

  $.get('beer.json', function(response){
    data = response;
  },"json").promise().done(function(data){
    for (var i = data.length - 1; i >= 0; i--) {
      data[i].color = colorscale.beer.pick(data[i].rating);
      data[i].date = parseInt(data[i].drinkMonth,10)+", "+data[i].drinkYear;
    }

    $scope.beers = data;
  });

  $scope.$watch('search', function (val) {
      if (timeout) $timeout.cancel(timeout);

      tempQuery = val;
      timeout = $timeout(function() {
          $scope.query = tempQuery;
      }, 200);
  });

}


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


