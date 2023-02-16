const id_ref_1 = "#developing_1"

const margin_1 = { top: 20, right: 20, bottom: 70, left: 20 },
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 768 - margin_1.top - margin_1.bottom;

// Scale factor on both dimensions (width and height)
const scaleFactor_1 = 1;

// The svg
const svg_1 = d3.select(id_ref_1)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", '0 0 ' + (width_1+ margin_1.left + margin_1.right) +
    ' ' + (height_1 + margin_1.top + margin_1.bottom))
    .append("g")
    .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);


// Map and projection
const path_1 = d3.geoPath();
const projection = d3.geoMercator()
  .center([0,20])
  .translate([width_1 / 2,60+ height_1 / 2]);

// Data and color scale
let data_1 = new Map()
const colorScale_1 = d3.scaleThreshold()
  .domain([50, 55, 60, 65, 70, 75, 80, 85])
  .range(d3.schemeBlues[8]);

// Add color legend
shapeWidthLegend_1 = 70;
const labels_1 = [50, 55, 60, 65, 70, 75, 80, 85];
const legend_1_size = shapeWidthLegend_1*labels_1.length;

const legend_1 = d3.legendColor()
    .labels(function (d) { return labels_1[d.i]; })
    .shapePadding(0)
    .orient("horizontal")
    .shapeWidth(shapeWidthLegend_1)
    .scale(colorScale_1)
    .labelAlign("start");

svg_1.append("g")
    .attr("class", "legendThreshold")
    .attr("font-family", "Fira Sans, sans-serif")
    .attr("font-size", "12px")
    .attr("transform", `translate(${(scaleFactor_1*width_1 - legend_1_size - (margin_1.left - margin_1.right))/2},
                                  ${height_1 - margin_1.bottom/2})`);

svg_1.select(".legendThreshold")
    .append("text")
        .attr("class", "caption")
        .attr("x", legend_1_size/2)
        .attr("y", -20)
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .text("Life Expectancy");

svg_1.select(".legendThreshold")
    .call(legend_1);

// Create a tooltip
const tooltip_1 = d3.select(id_ref_1)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

// Load external data and boot
Promise.all([
d3.json("../../data/world.geojson"),
d3.csv("../../data/developing_plot1.csv", function(d) {
    data_1.set(d.Country, +d.Life_expectancy)
})
]).then(function(loadData){
    let topo_1 = loadData[0]

    // Draw the map
    svg_1.append("g")
        .selectAll("path")
        .data(topo_1.features)
        .join("path")
            // draw each country
            .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", (d) => colorScale_1(data_1.get(d.properties.name)||0))
        .style("fill-opacity", "0.9")
        .attr("class", (d) => `state${d.properties.name}`)
        .style("stroke", "white")

    // Animations and filling of tooltip
    svg_1.join("g")
    .selectAll("path")
    // MouseOver
    .on("mouseover", function (event, d) {
        // Opacity 0.5 to all the neighborhoods
        svg_1.selectAll("path")
            .style("stroke", "transparent")
            .style("fill-opacity", "0.5")
            .transition("selected")
            .duration(300);
        
        // Select the specific neighborhood and
        var state = d.properties.name;
        svg_1.selectAll(`.state${state}`)
            .style("stroke", "#000")
            .style("stroke-width", "1px")
            .style("fill-opacity", "1.0")
            .transition("selected")
            .duration(300);

        // Appear tooltip
        tooltip_1.transition("appear-box")
            .duration(300)
            .style("opacity", "0.9");
        
        // Tooltip content
        tooltip_1.html("<span class='tooltiptext'>" + "<b>Name: " + d.properties.name +
            "</b><br>" + "Life Expectancy: " + data_1.get(d.properties.name))
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    // MouseOut
    .on("mouseout", function (event, d) {
            
        // All the neighborhoods to the original settings
        svg_1.selectAll("path")
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .style("fill-opacity", "0.9")
            .transition("selected")
            .duration(300);
    });

    svg_1.selectAll("g")
        // MouseLeave
        .on("mouseleave", function (event, d) {
            // Disappear tooltip
            tooltip_1.transition("disappear-box")
                .duration(300)
                .style("opacity", "0.0");
        });
})

