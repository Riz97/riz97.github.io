



const id_ref_1 = "#choropleth-map-developed"


// The svg
// Set the dimensions and margins of the graph
const margin_1 = { top: 50, right: 20, bottom: 70, left: 20 },
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 768 - margin_1.top - margin_1.bottom;
    
// Scale factor on both dimensions (width and height)
const scaleFactor_1 = 0.9;

// Append the svg_1 object to the page
const svg_1 = d3.select(id_ref_1)
    .append("svg")
    //.attr("width", width_1 + margin_1.left + margin_1.right)
    //.attr("height", height_1 + margin_1.top + margin_1.bottom)
    .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) +
        ' ' + (height_1 + margin_1.top + margin_1.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor_1)*width_1/2 + margin_1.left},
                                  ${(1-scaleFactor_1)*height_1/2 + margin_1.top})`);

// Map and projection
const path = d3.geoPath();
var projection = d3.geoMercator().center([0,0]).scale(150);

// Data and color scale
let data = new Map()
const colorScale = d3.scaleThreshold()
  .domain([73, 75, 77, 79, 80, 81])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("../../data/world.geojson"),
d3.csv("../../data/developed/developed1-2.csv", function(d) {
    data.set(d.Country, +d.Life_expectancy)
})
]).then(function(loadData){
    let topo = loadData[0]

    // Draw the map
  svg_1.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
})