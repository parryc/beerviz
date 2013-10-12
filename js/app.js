colorscale.create([
        {'value':0, 'color':{'r':94,'g':83,'b':64}},
        {'value':2.5,'color':{'r':234,'g':186,'b':110}},
        {'value':5,'color':{'r':110,'g':176,'b':234}}
        ], "beer");

function BeerCtrl($scope, $http, $timeout) {
  var data = null, timeout = null, timeoutTime = 200, tempQuery = '', currentSort = [], filteredList = [], filteredListIds = [];

  //For testing purposes only. Switch to pure angular once everything is pretty
  $.get('beer.json', function(response){
    data = response;
  },"json").promise().done(function(data){
    for (var i = data.length - 1; i >= 0; i--) {
      data[i].color = colorscale.beer.pick(data[i].rating);
      data[i].wordRating = parseRating(data[i].rating);
      data[i].date = new Date(data[i].drinkMonth+"/"+"01/"+data[i].drinkYear);//moment(parseInt(data[i].drinkMonth,10)+"/"+"01/"+data[i].drinkYear).format('MMM, YYYY');
      data[i].dateSmall = data[i].drinkMonth+"/"+data[i].drinkYear;
    }

    $scope.beers = data;
    $scope.query = '';
    $scope.filteredBeers = [];
    $scope.filteredList = [];
    $scope.activeContext = 'stats';
  });

  $scope.filterBeers = function(filterId){
    var group, value, parts = filterId.split('-');
    group = parts[0];
    value = parts[1];
    $scope.filteredBeers = filterByParam(group,value,$scope.beers);
  };

  $scope.getFilteredList = function(filterId, level){
    filteredListIds[level] = filterId;
    $scope.filteredList[level] = chunk(getUniqueByParam(filterId, $scope.beers).sort(function (a, b) {
      return a.localeCompare(b);
    }),15);

    console.log($scope.filteredList[level]);

    if(level > 0) {
      $scope.beerData = {};
      $scope.filteredBeers = filterByParam(filteredListIds[level-1],filteredListIds[level],$scope.beers);
      $scope.beerData.average = parseRating(average("rating",$scope.filteredBeers));
      vertbar('rating',filteredListIds[level-1],filteredListIds[level]);
    } else
      $scope.filteredBeers = [];
  };

  $scope.isFilter = function(filterId){
    return filteredListIds.indexOf(filterId) !== -1 ? 'category-active' : undefined;
  };

  $scope.isActive = function(menu){
    return $scope.activeContext === menu ? 'menu-item-active' : undefined;
  };

  $scope.isActiveContext = function(context){
    return $scope.activeContext === context;
  };

  $scope.getSort = function(item){
    var loc, temp;
    if(currentSort.indexOf(item) === -1 && currentSort.indexOf('-'+item) === -1 ) {
      currentSort.unshift(item);
    } else {
      loc = currentSort.indexOf('-'+item);
      if(loc === -1)
        loc = currentSort.indexOf(item);
      
      if(item === currentSort[loc]) {
        if(item.substring(0) === '-')
          temp = item;
        else
          temp = "-"+item;
      } else
          temp = item;

      currentSort.splice(loc,1);
      currentSort.unshift(temp);
    }

    return currentSort;
  };

  $scope.switchContext = function(context){
    $scope.activeContext = context;
  };


  $scope.$watch('search', function (val) {
      var tempQuery = '',
          isMobile = $('#might-be-mobile').css("display") === "block";
      if(timeout) $timeout.cancel(timeout);

      if(isMobile)
        tempQuery = (val || 'definitelynotabeer');
      else
        tempQuery = (val || 'all');

      timeout = $timeout(function() {
        if(tempQuery.length > 2) {
          if(tempQuery === 'all')
            $scope.query = '';
          else
            $scope.query = tempQuery;
          timeoutTime = 200;
        }
        // } else {
        //   if(tempQuery.length === 0)
        //     $scope.query = '';
        //   timeoutTime = 400;
        // }
      }, timeoutTime);
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

function countByParam(param, json){
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

function getUniqueByParam(param, json){
  var uniqueList = [];
  for (var i = json.length - 1; i >= 0; i--) {
    if($.inArray(json[i][param],uniqueList) === -1)
      uniqueList.push(json[i][param]);
  }
  return uniqueList;
}

function filterByParam(param, value, json) {
  var list = [];
   for (var i = json.length - 1; i >= 0; i--) {
    if(json[i][param] === value)
      list.push(json[i]);
  }
  return list;
}

function average(param, json) {
  var total = 0,
      length = json.length;
  for (var i = json.length - 1; i >= 0; i--) {
    total += json[i][param];
  }
  return (total/length).toFixed(1);
}

function drillDown(paramArray, json){
  var currentGroup = json;
  for(var i = 0; i < paramArray.length; i++) {
    currentGroup = filterByParam(paramArray[i].group, paramArray[i].value, currentGroup);
  }

  return currentGroup;
}

/*
find all properties in a list of objects that meet a certain parameter
*/

function findProp(list, property, name){
  return $.grep(list, function(item){
    return item[property] == name;
  });
}

function parseRating(rating){
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
}

function chunk(array, size){
  var chunked = [];
  for(var i = 0; i < array.length; i+=size){
    chunked.push(array.slice(i,i+size));
  }
  return chunked;
}

//Used for keyup delay.  From SO #1909441
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();


