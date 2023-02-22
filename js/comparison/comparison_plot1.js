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
d3.csv("../../data/comparison/comparison-1_1.csv").then( function(data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.Country); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([ 0, width_1 ]);
  svg_1.append("g")
    .attr("transform", `translate(0, ${height_1})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([30, d3.max(data, function(d) { return +d.Life_expectancy; })])
    .range([ height_1, 0 ]);
  svg_1.append("g")
    .call(d3.axisLeft(y));
  

  // color palette
  const color = d3.scaleOrdinal()
  .domain(["Austria","Bangladesh","Bulgaria","Brazil","Ethiopia","Germany","India","Indonesia","Italy","Netherlands","Nigeria","Pakistan","Philippines","Poland","Romania","Russian Federation","Sweden", "Switzerland","Spain", "Turkey","AVG Developed","AVG Developing"])
  .range(["#1982c4" ,"#ff595e", "#1982c4","#ff595e", "#ff595e", "#1982c4","#ff595e", "#ff595e", "#1982c4","#1982c4", "#ff595e", "#ff595e","#ff595e", "#1982c4", "#1982c4","#ff595e", "#1982c4", "#1982c4","#1982c4", "#ff595e","#79fff3","#ff04b6"])


    const tooltip = d3.select(id_ref_1)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);
 
  // Draw the line
  svg_1.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(+d.Life_expectancy); })
            (d[1])
        })
        
    // Y axis label
    svg_1.append("text")      // text label for the y axis
    .attr("x", (-height_1  / 2))
    .attr("y", -30)
    .style("text-anchor", "middle")
    .style("class", "h2")
    .style("font-size", "16px")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy");

// X axis label
svg_1.append("text")      // text label for the x axis
    .attr("x", (width_1 / 2))
    .attr("y", (height_1 + margin_1.bottom)-30)
    .style("class", "h2")
    .style("font-size", "16px")
    .style("text-anchor", "middle")
    .text("Year");

        svg_1.selectAll("path")
        .style("opacity" , 0.5)
        
            // MouseOver
            .on("mouseover", function (event, d) {
                d3.select(event.currentTarget)
                    .transition("selected")
                        .duration(300)
                        .style("opacity", 1.0);
        
                tooltip.transition("appear-box")
                    .duration(300)
                    .style("opacity", .9)
                    // Added to control the fact that the tooltip disappear if
                    // we move between near boxes (horizontally)
                    .delay(1);
              
                //tooltip
                tooltip.html("<span class='tooltiptext'>" + "<b>Life Expectancy in  " + d[0]) //+ " <br> that is a  " +   d[1][0].Status  + " country" + "</b><br>" + "</span>")
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
        
            })
        
            // MouseOut
            .on("mouseout", function (event, d) {
                d3.select(event.currentTarget)
                   .transition("unselected")
                        .duration(300)
                        .style("opacity", 0.5);
        
                tooltip.transition("disappear-box")
                    .duration(300)
                    .style("opacity", 0);
            });
  
    // Handmade legend  "#1982c4", "#ff595e","#79fff3","#ff04b6"
svg_1.append("circle").attr("cx",700).attr("cy",500).attr("r", 6).style("fill", "#1982c4")
svg_1.append("circle").attr("cx",700).attr("cy",530).attr("r", 6).style("fill", "#ff595e")
svg_1.append("circle").attr("cx",700).attr("cy",560).attr("r", 6).style("fill", "#79fff3")
svg_1.append("circle").attr("cx",700).attr("cy",590).attr("r", 6).style("fill", "#ff04b6")
svg_1.append("text").attr("x", 720).attr("y", 500).text("Developed").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#1982c4")
svg_1.append("text").attr("x", 720).attr("y", 530).text("Developing").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#ff595e")
svg_1.append("text").attr("x", 720).attr("y", 560).text("AVG Developed").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#79fff3")
svg_1.append("text").attr("x", 720).attr("y", 590).text("AVG Developing").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#ff04b6")

    
})