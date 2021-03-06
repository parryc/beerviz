//Interaction
function vertbar(filter, secondFilter, filterText){

  d3.select('svg').remove();

  var height = 250,
      chart = d3.select('#stats-vert-chart').append('svg')
                .attr('class','chart')
                .attr('height',height)
              .append('g')
                .attr("transform","translate(10,15)"),
      h = 200,
      w = 10,
      max, fullData;

  data = window.beers;

  if(secondFilter)
    data = filterByX(data, secondFilter, filterText);
  fullData = data;
  data = reduceList(data, filter);
  d3.select('svg').attr('width',(data.length+1)*w*2);
  
  max = d3.entries(data).sort(function(a, b) { return d3.descending(a.value.count, b.value.count); })[0];

  // x = d3.scale.linear()
  //   .domain([0, max.value.count])
  //   .range([0, width-300]);
  // y = function(i) { return 20 * i; };

  x = d3.scale.linear()
        .domain([0, 1])
        .range([0, w]);

  if(filter === "rating") {
    x = function(i) {
      return data[i].filter*10*w;
    };
    d3.select('svg').attr('width',500);
  }

  if(filter === "drinkDate") {
    x = function(i) {
      return (parseInt(data[i].filter.substring(0,4),10)-2010)*(12*w) + parseInt(data[i].filter.substring(5),10)*w;
    };
    d3.select('svg').attr('width',3*12*w*2);
  }

  y = d3.scale.linear()
        .domain([0, 100])
        .rangeRound([0, h]);

  // chart.selectAll("line")
  //   .data(x.ticks(10))
  // .enter().append("line")
  //   .attr("x1", x)
  //   .attr("x2", x)
  //   .attr("y1", 0)
  //   .attr("y2", (data.length+1)*20)
  //   .style("stroke", "#ccc");

  chart.selectAll("rect").data(data)
    .enter().append("rect")
      .attr("x", function(d, i) { return x(i) - 0.5;})
      .attr("y", function(d) { return h - y(d.count);})
      .attr("width", function(d) { return w; })
      .attr("height", function(d) { return y(d.count)+3;})
      .on("click", function(d,i) {
        $('#stats').html('');
        d.ids.forEach(function(v){
          $('#stats').append(fullData[v].brewery + ' ' + fullData[v].name + "<br/>");
        });
      });
  
  chart.selectAll("text")
      .data(data)
    .enter().append("text")
      .attr("x", function(d, i) { return x(i) - 0.5;})
      .attr("y", 0)
      .attr("dx", 5)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .attr("transform", function(d, i) { return "translate("+(w/2-0.5+x(i))+","+(h-x(i))+")rotate(90)";})
      .text(function(d) { return d.filter;});

  chart.selectAll(".count")
      .data(data)
    .enter().append("text")
      .attr("x", function(d, i) { return x(i) - 5;})
      .attr("y", function(d, i) { return 0; })
      .attr("dx", 3)
      // .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .attr("class", "count")
      .attr("transform", function(d, i) { return "translate(0,"+(h-y(d.count))+")";})
      .text(function(d) { return d.count; });




  // chart.selectAll(".rule")
  //     .data(x.ticks(10))
  //   .enter().append("text")
  //     .attr("class", "rule")
  //     .attr("x", x)
  //     .attr("y", 0)
  //     .attr("dy", -3)
  //     .attr("text-anchor", "middle")
  //     .text(String);
}

function linechart(dataUrl, filter){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m").parse;
  var parseYear = d3.time.format("%Y").parse;
  var parseMonth = d3.time.format("%m").parse;

  var x = d3.time.scale()
    .range([0, width]);
  if(filter === "rating")
    x = d3.scale.linear().range([0,width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d, i){
      return ""+d;
    });

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.filter); })
    .y(function(d) { return y(d.count); });

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json(dataUrl, function(error, data) {
    data = reduceList(data, filter);

    data.forEach(function(d) {
      if(filter === "drinkDate")
        d.filter = parseDate(d.filter);
      else if(filter === "drinkYear")
        d.filter = parseYear(""+d.filter);
      else if(filter === "drinkMonth")
        d.filter = parseMonth(""+d.filter);
      else
        d.filter = ""+d.filter;
      d.count = +d.count;
    });
    console.log(data);
    x.domain(d3.extent(data, function(d) { return d.filter; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);
    if(filter === "rating")
      x.domain([0,10]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Beers");

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  });

}


//
// H   H
// HHHHH
// H   H E L P E R S
// H   H
//

/*
Load JSON data and save to global variable
*/

function load(url, callback) {
  d3.json(url,function(error, data){
    window.beers = data;
    callback();
  });
}

/*
  Reduces data to a simple count of a certain property.
  e.g. if reducer is "rating" it will return a count of all ratings

  NOTE: use "drinkDate" to automatically merge drinkYear and drinkMonth
*/
function reduceList(data, reducer){
  var reduced = [],
    hits;

  if(reducer === "drinkDate"){
    data.forEach(function(d){
      d.drinkDate = parseInt(d.drinkYear,10)+"-"+parseInt(d.drinkMonth,10);
    });
  }

  //The data is still messy - some of the years/months are strings.
  if(reducer === "drinkYear"){
    data.forEach(function(d){
      d.drinkYear = parseInt(d.drinkYear,10);
    });
  }
  if(reducer === "drinkMonth"){
    data.forEach(function(d){
      d.drinkMonth = parseInt(d.drinkMonth,10);
    });
  }

  //Check if the reduced list contains a count of each data element's individual "reducer"
  data.forEach(function(d, i){
    hits = $.grep(reduced, function(e){ return e.filter === d[reducer]; });
    if(hits.length !== 0) {
      hits[0].count++;
      hits[0].ids.push(i);
    } else
      reduced.push({filter: d[reducer], count: 1, ids: [i]});
  });
  if(reducer === "drinkDate")
    reduced.sort(function(a, b) {
      return moment(a.filter,"YYYY-MM").isBefore(moment(b.filter,"YYYY-MM")) ? -1 : moment(a.filter,"YYYY-MM").isAfter(moment(b.filter,"YYYY-MM")) ? 1 : 0;
    });
  else
    reduced.sort(function(a, b) {
      return a.filter < b.filter ? -1 : a.filter > b.filter ? 1 : 0;
    });

  return reduced;
}

/*
Finds the count and total ratings of topic
*/
function aggregate(data, field){
  var aggregated = {};
  data.forEach(function(d){
    if(aggregated[d[field]]) {
      aggregated[d[field]].count++;
      aggregated[d[field]].ratingTotal += d.rating;
    } else
      aggregated[d[field]] = {count: 1, ratingTotal: d.rating};
  });

  return aggregated;
}

var filterByX = function(data, type, filter){
  var filterer = function(e) {
    return e[type] === filter;
  };
  return data.filter(filterer);
};

if(!window.beers)
  load('beer.json', function(){
    //vertbar('rating', 'style', 'IPA');
  });