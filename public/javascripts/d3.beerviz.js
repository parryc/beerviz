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

function linechart(dataUrl){
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y-%m").parse;

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.close); });

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json(dataUrl, function(error, data) {
		data.forEach(function(d) {
			d.date = parseDate(d.drinkYear+"-"+d.drinkMonth);
			//d. = +d.close;
		});

		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain(d3.extent(data, function(d) { return d.close; }));

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
			.text("Price ($)");

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
	var reduced = {};

	if(reducer === "drinkDate"){
		data.forEach(function(d){
			d.drinkDate = d.drinkYear+"-"+d.drinkMonth;
		});
	}

	//Check if the reduced list contains a count of each data element's individual "reducer"
	data.forEach(function(d){
		if(reduced[d[reducer]])
			reduced[d[reducer]]++;
		else
			reduced[d[reducer]] = 1;
	});

	return reduced;
}