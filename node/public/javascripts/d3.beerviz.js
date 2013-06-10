//
//  DDDD
//  D   D
//  D   D I S P L A Y
//  DDDD
//

function barchart(dataUrl){
/*	var chart = d3.select("body").append("svg")
		.attr("class", "chart")
		.attr("width", 420)
		.attr("height", 20 * data.length);

	var x = d3.scale.linear()
		.domain([0, 10])
		.range([0, 420]);

	var y = d3.scale.ordinal();



	d3.json(dataUrl, function(error, data){
		
		//Cast to numeric
		data.forEach(function(d) {
			d.name = +d.frequency;
		});

	});

*/
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
	Reduces data to a simple count of a certain property.
	e.g. if reducer is "rating" it will return a count of all ratings

	NOTE: use "drinkDate" to automatically merge drinkYear and drinkMonth
*/
function reduceList(data, reducer){
	var reduced = [],
		hits;

	if(reducer === "drinkDate"){
		data.forEach(function(d){
			d.drinkDate = d.drinkYear+"-"+d.drinkMonth;
		});
	}

	//Check if the reduced list contains a count of each data element's individual "reducer"
	data.forEach(function(d){
		hits = $.grep(reduced, function(e){ return e.filter === d[reducer]; });
		if(hits.length !== 0)
			hits[0].count++;
		else
			reduced.push({filter: d[reducer], count: 1});
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