function multiline(data,yAxisLabel) {
  var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  color.domain(data.length);

  // data.forEach(function(d) {
  //   d.date = parseDate(d.drinkDate);
  // });

  // var cities = color.domain().map(function(name) {
  //   return {
  //     name: name,
  //     values: data.map(function(d) {
  //       return {date: d.date, temperature: +d[name]};
  //     })
  //   };
  // });

  //x.domain(d3.extent(data, function(d) { return d.date; }));
  x.domain([parseDate("2010-06"),new Date()]);
  y.domain([
    0,
    d3.max(data, function(d) { return d3.max(d.values, function(v) { return v.value; }); })
  ]);

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
      .text(yAxisLabel);

  var beer = svg.selectAll(".beer")
      .data(data)
    .enter().append("g")
      .attr("class", "beer");

  beer.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d,i) { return color(i); });

  beer.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

}
