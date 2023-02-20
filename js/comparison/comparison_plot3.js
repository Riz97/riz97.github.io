const id_ref_3 = "#ridgeline"
// set the dimensions and margin_3s of the graph
var margin_3 = {top: 10, right: 30, bottom: 30, left: 40},
    width_3 = 460 - margin_3.left - margin_3.right,
    height_3 = 400 - margin_3.top - margin_3.bottom;

// append the svg object to the body of the page
var svg_3 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width_3", width_3 + margin_3.left + margin_3.right)
    .attr("height_3", height_3 + margin_3.top + margin_3.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_3.left + "," + margin_3.top + ")");

// get the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_doubleHist.csv", function(data) {

  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([-4,9])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width_3]);
  svg_3.append("g")
      .attr("transform", "translate(0," + height_3 + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return +d.value; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(40)); // then the numbers of bins

  // And apply twice this function to data to get the bins.
  var bins1 = histogram(data.filter( function(d){return d.type === "variable 1"} ));
  var bins2 = histogram(data.filter( function(d){return d.type === "variable 2"} ));

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height_3, 0]);
      y.domain([0, d3.max(bins1, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg_3.append("g")
      .call(d3.axisLeft(y));

  // append the bars for series 1
  svg_3.selectAll("rect")
      .data(bins1)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width_3", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height_3", function(d) { return height_3 - y(d.length); })
        .style("fill", "#69b3a2")
        .style("opacity", 0.6)

  // append the bars for series 2
  svg_3.selectAll("rect2")
      .data(bins2)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width_3", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height_3", function(d) { return height_3 - y(d.length); })
        .style("fill", "#404080")
        .style("opacity", 0.6)

  // Handmade legend
  svg_3.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
  svg_3.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", "#404080")
  svg_3.append("text").attr("x", 320).attr("y", 30).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
  svg_3.append("text").attr("x", 320).attr("y", 60).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")

});