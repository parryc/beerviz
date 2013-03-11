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

/*
find all properties in a list of objects that meet a certain parameter

*/

function findProp(list, property, name){
	return $.grep(list, function(item){
		return item[property] == name;
	});
}




