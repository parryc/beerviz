var request = require('request'),
    cheerio = require('cheerio');


exports.beerSearch = function(query, callback, sortByDistance, fuzzySearch) {

    var url = "http://beeradvocate.com/search/?q=" + encodeURIComponent(query) + "&qt=beer";
    if(fuzzySearch)
        url += "&ls=Y";
    
    //http://www.merriampark.com/ld.htm, http://www.mgilleland.com/ld/ldjavascript.htm, Damerau–Levenshtein distance (Wikipedia)
    var levDist = function(s, t) {
        var d = []; //2d matrix

        // Step 1
        var n = s.length;
        var m = t.length;

        if (n === 0) return m;
        if (m === 0) return n;

        //Create an array of arrays in javascript (a descending loop is quicker)
        for (var i = n; i >= 0; i--) d[i] = [];

        // Step 2
        for (var i = n; i >= 0; i--) d[i][0] = i;
        for (var j = m; j >= 0; j--) d[0][j] = j;

        // Step 3
        for (var i = 1; i <= n; i++) {
            var s_i = s.charAt(i - 1);

            // Step 4
            for (var j = 1; j <= m; j++) {

                //Check the jagged ld total so far
                if (i == j && d[i][j] > 4) return n;

                var t_j = t.charAt(j - 1);
                var cost = (s_i == t_j) ? 0 : 1; // Step 5

                //Calculate the minimum
                var mi = d[i - 1][j] + 1;
                var b = d[i][j - 1] + 1;
                var c = d[i - 1][j - 1] + cost;

                if (b < mi) mi = b;
                if (c < mi) mi = c;

                d[i][j] = mi; // Step 6

                //Damerau transposition
                if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                    d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
                }
            }
        }

        // Step 7
        return d[n][m];
    };

    request(url, function (error, response, html) {

        if (!error && response.statusCode == 200) {

            var $ = cheerio.load(html);

            var beers = [];

            $('#baContent ul li').each(function(beer) {

                // One beer listing
                var li = $(this);

                // Beer details
                var beer = li.children('a').eq(0),
                    beer_name = beer.text(),
                    beer_url = beer.attr('href');

                // Brewery details
                var brewery = li.children('a').eq(1),
                    brewery_name = brewery.text(),
                    brewery_url = brewery.attr('href'),
                    brewery_location = brewery.next().text();

                // Retired?
                var retired = false;
                if (beer.prev().text() === "Retired - ") {
                    retired = true;
                }

                // Data to return
                var data = {
                    beer_name: beer_name,
                    beer_url: beer_url,
                    brewery_name: brewery_name,
                    brewery_location: brewery_location.slice(2),
                    brewery_url: brewery_url,
                    retired: retired
                };
                
                // Add to beer array
                beers.push(data);

            });

            if(sortByDistance) {
                beers.sort(function(a, b){
                    if(levDist(a.beer_name, query) < levDist(b.beer_name, query))
                        return -1;
                    else
                        return 1;
                });
            }

            callback(beers);

        }

    });

}

exports.beerPage = function(url, callback) {

    var url = "http://beeradvocate.com" + url;

    request(url, function (error, response, html) {

        if (!error && response.statusCode == 200) {

            var $ = cheerio.load(html);

            var beer = [];

            // Beer & brewery name
            var title = $('h1').text().split(/\s-\s/),
                beer_name = title[0],
                brewery_name = title[1];

            // ABV
            var beer_abv_chunk = $('#baContent table').eq(1).find('td').text().split(/%\sABV/)[0],
                beer_abv = beer_abv_chunk.substr(beer_abv_chunk.length - 6).trimLeft() + "%";

            // Brewery details
            var links = $('#baContent table').find('form').parent().find('a'),
                brewery_state = links.eq(2).text(),
                brewery_country = links.eq(3).text(),
                beer_style = links.eq(4).text();

            // Beer Advocate scores
            var ba_info = $('.BAscore_big').eq(0),
                ba_score = ba_info.text(),
                ba_rating = ba_info.next().next().text();

            var bros_info = $('.BAscore_big').eq(1),
                bros_score = bros_info.text(),
                bros_rating = bros_info.next().next().text();

            // More stats
            var stats = $('#baContent table').eq(2).find('td:last-child').text().split(/:\s/);

            //In case you get a page that doesn't have all of this (apparently it's possible)
            if(stats.length > 2) {
                var ratings = stats[1].replace("Reviews",""),
                reviews = stats[2].replace("rAvg",""),
                rAvg = stats[3].replace("\npDev",""),
                pDev = stats[4].replace("\n\nRatings Help\n","");
            }

            // Data to return
            var data = {
                beer_name: beer_name,
                beer_style: beer_style,
                beer_abv: beer_abv,
                brewery_name: brewery_name,
                brewery_state: brewery_state,
                brewery_country: brewery_country,
                ba_score: ba_score,
                ba_rating: ba_rating,
                bros_score: bros_score,
                bros_rating: bros_rating,
                ratings: ratings,
                reviews: reviews,
                rAvg: rAvg,
                pDev: pDev
            };

            // Add to beer array
            beer.push(data);

            callback(beer);

        }

    });

}