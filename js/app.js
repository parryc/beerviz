colorscale.create([
        {'value':0, 'color':{'r':50,'g':50,'b':50}},
        {'value':3.5,'color':{'r':234,'g':186,'b':110}},
        {'value':10,'color':{'r':110,'g':176,'b':234}}
        ], "beer");

function BeerCtrl($scope, $http, $timeout) {
  var data = null, timeout = null, timeoutTime = 200, tempQuery = '', currentSort = [];

  //For testing purposes only. Switch to pure angular once everything is pretty
  $.get('beer.json', function(response){
    data = response;
  },"json").promise().done(function(data){
    for (var i = data.length - 1; i >= 0; i--) {
      data[i].color = colorscale.beer.pick(data[i].rating);
      data[i].date = new Date(parseInt(data[i].drinkMonth,10)+"/"+"01/"+data[i].drinkYear);//moment(parseInt(data[i].drinkMonth,10)+"/"+"01/"+data[i].drinkYear).format('MMM, YYYY');
      data[i].dateSmall = parseInt(data[i].drinkMonth,10)+"/"+data[i].drinkYear;
    }

    $scope.beers = data;
    $scope.query = '';
  });

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


  $scope.$watch('search', function (val) {
      if (timeout) $timeout.cancel(timeout);

      tempQuery = val;
      timeout = $timeout(function() {
        if(tempQuery.length > 2) {
          $scope.query = tempQuery;
          timeoutTime = 200;
        } else {
          if(tempQuery.length === 0)
            $scope.query = '';
          timeoutTime = 400;
        }
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


