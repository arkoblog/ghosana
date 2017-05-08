var d3 = require('d3')
var _ = require('lodash');
var dataHelpers = require('./dataHelpers')
var mtip = require('d3-tip')
var d3Chart = {};


// console.log("tip", mtip)
d3Chart.create = function(el, props, state, config, selectedCat, callback) {
    console.log("Charting Starts here", selectedCat);
    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('height', props.height);

    svg.append('g')
        .attr('class', 'd3-points');

    this.update(el, state, config, selectedCat, callback);
};

d3Chart.update = function(el, state, config, selectedCat, callback) {
    // Re-compute the scales, and render the data points
    var scales = this._scales(el, state.domain);
    // this._drawPoints(el, scales, state.data);
    var countKeys = dataHelpers.countOccurences(state.rawdata, "category_1")
    var sortedKeys = dataHelpers.getUniqueKeys(countKeys, "key")
    var sortedData = dataHelpers.sortBasedOnArray(sortedKeys, state.rawdata, "category_1")

    this._drawRectangles(el, sortedData, config, selectedCat, callback)
};



d3Chart.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
};

d3Chart._scales = function(el, domain) {
    if (!domain) {
        return null;
    }

    var width = el.offsetWidth;
    var height = el.offsetHeight;

    var x = d3.scaleLinear()
        .range([0, width])
        .domain(domain.x);

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain(domain.y);

    var z = d3.scaleLinear()
        .range([5, 20])
        .domain([1, 10]);

    return { x: x, y: y, z: z };
};

d3Chart._drawPoints = function(el, scales, data) {
    var g = d3.select(el).selectAll('.d3-points');

    var point = g.selectAll('.d3-point')
        .data(data, function(d) {
            return d.id;
        });

    // ENTER
    point.enter().append('circle')
        .attr('class', 'd3-point');

    // ENTER & UPDATE
    point.attr('cx', function(d) {
            return scales.x(d.x);
        })
        .attr('cy', function(d) {
            return scales.y(d.y);
        })
        .attr('r', function(d) {
            return scales.z(d.z);
        });

    // EXIT
    point.exit()
        .remove();
};


d3Chart._drawRectangles = function(el, data, config, selectedCat, callback) {

    var c10 = d3.scaleOrdinal(d3.schemeCategory20);

    var customColorScheme1 = function(n) {
        var colores_g = ["#3a1c71", "#442371", "#4e2b72", "#593372", "#633a73", "#6d4273", "#784a74", "#825274", "#8c5975", "#976175", "#a16976", "#ac7176", "#b67877", "#c08077", "#cb8878", "#d59078", "#df9779", "#ea9f79", "#f4a77a", "#ffaf7b"];
        return colores_g[n % colores_g.length];
    }

    var customColorScheme = function(n) {
        var colores_g = ["#ccc", "#ddd", "#eee"];
        return colores_g[n % colores_g.length];
    }

    var g = d3.select(el).selectAll('.d3-points');

    var point = g.selectAll('.d3-point')
        .data(data, function(d) {
            return d.commitment;
        })

    var uniqueKeys = dataHelpers.getUniqueKeys(data, "category_1")
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    point.enter().append('rect')
        .attr('transform', function(d, i) {
            var col_index = i % config.no_of_columns;
            var row_index = Math.floor(i / config.no_of_columns);
            var xTranslate = config.squareLength() * col_index;
            var yTranslate = config.squareLength() * row_index;
            return 'translate(' + xTranslate + ',' + yTranslate + ')';
        })
        .attr('width', config.squareLength() - 1)
        .attr('height', config.squareLength() - 2)
        .style("fill", function(d, i) {
            var cat_index = uniqueKeys.indexOf(d.category_1)
            return d.category_1 == selectedCat ? "red" : customColorScheme(cat_index)
                // return c10(d.category_1)
                // return customColorScheme(cat_index)
        })
        .style('stroke', "white")
        .attr('class', 'd3-point')
        .on('mouseover', function(dat) {
            // tip.show;
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Category: " + dat.category_1 + "<br/>Commitment: " + dat.commitment + "<br/>Click to compare commitments across parties.")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 48) + "px");
            // console.log(dat)
            g.selectAll('rect')
                .filter(function(d) {
                    return d.category_1 == dat.category_1;
                })
                .style('fill', 'red')
            g.selectAll('rect')
                .filter(function(d) {
                    return d.category_1 != dat.category_1;
                })
                .style('fill', function(d, i) {
                    // return c10(d.category_1)
                    var cat_index = uniqueKeys.indexOf(d.category_1)
                    return customColorScheme(cat_index)
                })
        })
        .on('mouseout', function(dat) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            // console.log(dat)
            g.selectAll('rect')
                .filter(function(d) {
                    return d.category_1 == dat.category_1;
                })
                .style("fill", function(d, i) {
                    // return c10(d.category_1)
                    var cat_index = uniqueKeys.indexOf(d.category_1)
                    return customColorScheme(cat_index)
                })
            g.selectAll('rect')
                .filter(function(d) {
                    return d.category_1 != dat.category_1;
                })
                .style("fill", function(d, i) {
                    // return c10(d.category_1)
                    var cat_index = uniqueKeys.indexOf(d.category_1)
                        // return customColorScheme(cat_index)
                    return d.category_1 == selectedCat ? "red" : customColorScheme(cat_index)

                });

        })
        .on('click', function(dat) {
            console.log(callback)
            div.transition()
                .duration(500)
                .style("opacity", 0);
            callback(dat.category_1)

            g.selectAll('rect')
                .filter(function(d) {
                    return d.category_1 == dat.category_1;
                })
                .style("fill", function(d, i) {
                    // return c10(d.category_1)
                    var cat_index = uniqueKeys.indexOf(d.category_1)
                    return customColorScheme(cat_index)
                })
            g.selectAll('rect')
                .filter(function(d) {
                    return d.category_1 != dat.category_1;
                })
                .style("fill", function(d, i) {
                    // return c10(d.category_1)
                    var cat_index = uniqueKeys.indexOf(d.category_1)
                        // return customColorScheme(cat_index)
                    return d.category_1 == selectedCat ? "red" : customColorScheme(cat_index)

                });

            // g.selectAll('rect')
            // .filter(function(d) {return d.commitment == dat.commitment; })
            //   .style("stroke", "red");

            // g.selectAll('rect')
            // .filter(function(d) {return d.commitment != dat.commitment; })
            //   .style("stroke", "white");
            // console.log(dat)
        });

    // point

    point.exit()
        .remove();

};
module.exports = d3Chart
