/*
  Requires data to be loaded in from somewhere else and underscore.js
*/

(function (root) {
  function beerMe() {
    return {

      groups: {
        abv: ["0-5","5-7","7-9","9-11","11-100"]
      },
      hierarchies: {
        style: {
          "All" : {
            "Ales" : {
              "Belgian" : {
                "Abbey Ales" : ["Abbey Dubbel", "Abbey Tripel", "Quadrupel"],
                "Belgian Ales" : ["Belgian Ale", "Belgian Strong Ale"]
              },
              "Saisons" : ["Saison"],
              "German Ales" : {
                "Other German Ales" : ["Altbier","Kölsch"],
                "Bocks" : ["Doppelbock","Dunkler Bock","Heller Bock","Weizen Bock"]
              },
              "IPAs" : ["IPA","Double IPA","Black IPA"],
              "Others" : {
                "Pale Ales" : ["Old Ale","Bière de Garde","Amber Ale","Scotch Ale","Golden Ale"],
                "American Ales" : ["American Strong Ale", "American Pale Ale"],
                "English Ales" : ["English Pale Ale","Bitter","Premium Bitter","English Strong Ale","Mild Ale"],
                "Other Ales" : ["Barley Wine","Brown Ale","California Common","Cream Ale","Irish Ale","Scottish Ale","Traditional Ale"]
              }
            },
            "Wheat Beers" : ["Dunkelweizen","Hefeweizen","Kristallweizen","Wheat Ale","Gose","Belgian White"],
            "Lagers" : {
                "German Lagers" : ["Dortmunder","Dunkel","Oktoberfest","Schwarzbier","Vienna","Zwickel"],
                "Pilseners" : ["Pilsener","Imperial Pils"],
                "Other Lagers" : ["American Dark Lager","Pale Lager","Malt Liquor","Specialty Grain"]
            },
            "Stouts/Porters" : ["Baltic Porter","Dry Stout","Foreign Stout","Imperial Stout","Smoked","Strong Porter","Porter","Sweet Stout","Stout"],
            "Flavored" : ["Spice","Fruit Beer"],
            "Lambics" : ["Lambic","Flanders Sour","Sour","Gueuze"]
          }
        },
        rating: {
          "All" : {
            "Great" : ['4','4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9'],
            "Good" : ['3','3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9'],
            "Ok" : ['2','2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','2.9'],
            "Meh" : ['1','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9'],
            "Bad" : ['0','0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9']
          }
        },
        print: function(h) {
          var _search = function(level, hierarchy, result) {
            var h = hierarchy, output = "";
            for(var key in h) {
              output = "";
              for(var i = 0; i < level; i++) {
                output += ">";
              }
              output += key;
              result.push(output);

              if(!_.isArray(h[key])) {
                result = _.union(result,_search(level+1, h[key], result));
              } else {
                for(var j = 0; j < h[key].length; j++) {
                  output = "";
                  for(var i = 0; i < level+1; i++) {
                    output += ">";
                  }
                  output += h[key][j];
                  result.push(output);
                }

              }
            }

            return result;
          };

          return(_search(1, beer.hierarchies[h], []));
        }
      },



      init: function(data) {
        var index = {
          "brewery": {},
          "country": {},
          "drinkLocationCity": {},
          "drinkLocationCountry": {},
          "drinkDate": {},
          "drinkYear": {},
          "rating": {},
          "style": {},
          "abv": {}
        },
        indexes = ['brewery','country','drinkLocationCity','drinkLocationCountry','drinkDate','drinkYear','rating','style','abv'],
        cat, j;

        //Create index list for each attribute in indexes array
        data.forEach(function(d, idx){
          for (j = indexes.length - 1; j >= 0; j--) {
            cat = indexes[j];
            if(cat === 'drinkDate')
              d.drinkDate = moment(d.drinkYear+'-'+d.drinkMonth,'YYYY-MM').format('YYYY-MM');

            if(index[cat][d[cat]] === undefined)
              index[cat][d[cat]] = [idx];
            else
              index[cat][d[cat]].push(idx);
          }
        });

        this.beers = data;
        this.index = index;

        if(!window._) {
          console.log("*** You need Underscore.js to continue. It makes life easier, trust me.");
        }
      },


      //takes an array of accessors and gets the intersect'd list
      //ex. ["brewery.Ommegang","drinkLocationCity.Ithaca"]
      get: function(accessors){
        var temp = [],
            index = this.index,
            split, intersect;

        for (var i = 0; i < accessors.length; i++) {
          split = accessors[i].split('.');
          temp = index[split[0]];

          for(var j = 1; j < split.length; j++) {
            temp = temp[split[j]];
          }

          if(intersect === undefined)
            intersect = temp;
          else
            intersect = _.intersection(intersect, temp);
        }

        return intersect;
      },

      /*
        Wrapper for _lookup+get combo
      */
      lookget: function(accessors) {
        if(!_.isArray(accessors))
          accessors = [accessors];
        return this.lookup(this.get(accessors));
      },

      /*
        Return Beer objects from a list of indexes
      */
      lookup: function(indexList){
        var output = [], list;
        for (var i = 0; i < indexList.length; i++) {
          list = this.beers[indexList[i]];
          if(list !== undefined)
            output.push(list);
        }
        return output;
      },

      /*
        Return a list of keys of an index's section.
      */
      getKeys: function(section){
        return _.keys(this[section]);
      },

      /*
        search a hierarchy for an attribute
      */
      hierarchySearch:  function(attribute, hierarchy) {
        var h = hierarchy,
            root = h.All,
            result;

        var _search = function(attribute, hierarchy, result) {
          var h = hierarchy;
          for(var key in h) {
            if(key === attribute) {

              return h[key];
            } else if(!_.isArray(h[key])) {
              result = _.union(result,_search(attribute, h[key]), result);
            }
          }
          return result;
        };

        var _removeUndefined = function(array) {
          var clean = [];
          for(var i = 0; i < array.length; i++) {
            if(typeof array[i] !== 'undefined') 
              clean.push(array[i])
          }
          return clean;
        };


        if(attribute === "All")
          return root;
        else {
          result = _search(attribute, root, []);
          //bah, want to figure out why they all end in an undefined...
          //if it returns an object, make sure you just return the object,
          //but if it's an array, return everything.

          if(!_.isArray(result))
            return result;
          else
            return  _removeUndefined(result);
        }
      },

      flatten: function(object) {
        var result = [];

        if(_.isArray(object)) {
          for(var i = 0; i < object.length; i++) {
            if(_.isString(object[i]))
              result = _.union(result,object[i]);
            else
              result = _.union(result, this._flatten(object));
          }

          return result;
        } else {

          return this._flatten(object);
        }
      },

      /*
        flatten helper function
      */
      _flatten: function(object) {
        var result = [];
        for(var key in object) {
            if(_.isArray(object[key]))
              result = _.union(result,object[key]);
            else
              result = _.union(result,this.flatten(object[key]));
          }
          return result;
      },


      getHierarchyDetails: function(attribute, hierarchy, type) {
        var search = this.flatten(this.hierarchySearch(attribute,hierarchy)),
            result = [];

        if(!_.isEmpty(search)) {
          for (var i = 0; i < search.length; i++) {
            result = _.union(result, this.index[type][search[i]]);
          }
          return result;
        } else
            return this.index[type][attribute];
      },

      /*
        Wrapper to get a list of Beer objects from the style hierarchy.
      */
      styles: function(accessor) {
        return this.lookup(this.getHierarchyDetails(accessor, this.hierarchies.style, "style"));
      },

      /*
        Wrapper to get a list of Beer objects from the rating hierarchy.
      */
      ratings: function(accessor) {
        return this.lookup(this.getHierarchyDetails(accessor, this.hierarchies.rating, "rating"));
      },

      /*
        Returns indexes based on the groups.
        Currently supports ranged groups (indicated by a single -).
        This is also inefficient. Whatever.
      */
      group: function(group) {
        var groupArr = this.groups[group],
            beers = this.index[group],
            groups = {},
            range, start, end;

        for (var i = groupArr.length - 1; i >= 0; i--) {
          range = groupArr[i].split('-');
          groups[range] = [];
          start = range[0];
          end = range[1];
          for(var rating in beers) {
            if(start <= +rating && +rating < end) {
              if(!groups[range])
                groups[range] = beers[rating];
              else
                groups[range] = _.union(groups[range],beers[rating]);
            }
          }
        }

        return groups;
      },

      /*
        Lump information by a specific field.
        Includes running count and average information
      */
      aggregate: function(data, field){
        var aggregated = {};

        data.forEach(function(d){
          if(aggregated[d[field]]) {
            aggregated[d[field]].count++;
            aggregated[d[field]].ratingTotal += d.rating;
            aggregated[d[field]].abvTotal += d.abv;
            aggregated[d[field]].average = +(aggregated[d[field]].ratingTotal/aggregated[d[field]].count).toFixed(2);
            aggregated[d[field]].averageAbv = +(aggregated[d[field]].abvTotal/aggregated[d[field]].count).toFixed(2);
          } else
            aggregated[d[field]] = {
              count: 1,
              ratingTotal: d.rating,
              average: d.rating.toFixed(2),
              abvTotal: d.abv,
              averageAbv: d.abv.toFixed(2),
              name: d[field]};
        });

        return aggregated;
      },

      print: function(list, onlyAboveFive) {
        var tabs = "";
        for(var l in list){ 
          if((list[l].count > 5 && onlyAboveFive) || !onlyAboveFive) {
            if(list[l].name.length > 14)
              tabs = "\t";
            else if(list[l].name.length >= 12)
              tabs = "\t\t";
            else if(list[l].name.length >= 7)
              tabs = "\t\t";
            else
              tabs = "\t\t\t"; 
            console.log(list[l].name + tabs + 'count:\t' + list[l].count +'\tavg:\t'+ list[l].average + '\tavg abv:\t' + list[l].averageAbv); 
          }
        }
      },

      /*
        for example:
        series: ["IPAs","Pale Lagers"]
        yAxis: "count" || "average"
        type: 'styles'
      */
      formatMultiseries: function(series, type, yAxis, labelOverrides, aggregator) {
        var seriesList = [],
            labels = [],
            aggregator = aggregator || "drinkDate",
            label;
        for (var i = 0; i < series.length; i++) {
          if(typeof labelOverrides === 'undefined')
            label = series[i]
          else
            label = labelOverrides[i] || series[i];
          labels.push(label);
          seriesList.push(this.aggregate(this[type](series[i]),aggregator));
        }

        var zipped = [], temp, totalCount, totalRating, dataList, value, parseDate;

        if(!window.d3)
          parseDate = function(d) { return d; };
        else
          parseDate = d3.time.format("%Y-%m").parse;

        for (var i = 0; i < seriesList.length; i++) {
          dataList = _.sortBy(seriesList[i],function(d){return d.name});
          temp = [];
          totalAbv = 0;
          totalCount = 0;
          totalRating = 0;

          for(var d in dataList) {
            totalAbv += dataList[d].abvTotal;
            totalCount += dataList[d].count;
            totalRating += dataList[d].ratingTotal;
            if(yAxis === "count")
              value = totalCount;
            else if(yAxis === "abv")
              value = +(totalAbv/totalCount).toFixed(2);
            else
              value = +(totalRating/totalCount).toFixed(2);

            temp.push({
              'date':parseDate(dataList[d].name),
              'value': value
            });
          }

          temp = _.sortBy(temp, function(d){return d.date;});
          zipped.push({
            name: labels[i],
            values: temp
          });
        }

        return zipped;
      }
    };
  }

  function load(url, callback) {
    d3.json(url,function(error, data){
      callback(data);
    });
  }

  root.beer = beerMe();
  // load('beer.json', function(beers){
  //   root.beer.init(beers);
  //   multiline(root.beer.formatMultiseries(["Ales","Lagers"],"styles","count"),"Counts");
  // });
//  root.beer.init(options);
})(this)
