// -------------------------------------------------------------------------
//LINECHART
//--------------------------------------------------------------------------
const id_ref_1 = "#linechart";
// set the dimensions and margin_1s of the graph
const margin_1 = {top: 20, right: 120, bottom: 70, left: 45},
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 768 - margin_1.top - margin_1.bottom;

// Scale factor on both dimensions (width and height)
const scaleFactor_1 = 1;

// Append the svg_5 object to the page
const svg_1 = d3.select(id_ref_1)
    .append("svg")
    //.attr("width", width_5 + margin_5.left + margin_5.right)
    //.attr("height", height_5 + margin_5.top + margin_5.bottom)
    .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) +
        ' ' + (height_1 + margin_1.top + margin_1.bottom))
    .append("g")
    .attr("transform", `translate(${(1 - scaleFactor_1) * width_1 / 2 + margin_1.left},
                                  ${(1 - scaleFactor_1) * height_1 / 2 + margin_1.top})`);

//Read the data 
//ORA CI SONO I TOP 20 PER POPOLAZIONE ma non riesco a metterli di colori diversi in base allo status
d3.csv("../../data/comparison/comparison-1.csv").then( function(data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.Country); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([ 0, width_1 ]);
  svg_1.append("g")
    .attr("transform", `translate(0, ${height_1})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([30, d3.max(data, function(d) { return +d.Life_expectancy; })])
    .range([ height_1, 0 ]);
  svg_1.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
    .range(d3.schemeCategory10)

  // Draw the line
  svg_1.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(+d.Life_expectancy); })
            (d[1])
        })


       
       
   
    

})