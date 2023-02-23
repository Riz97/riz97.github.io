const id_ref_3 = "#barchart"

// Set the dimensions and margins of the graph
const margin_3 = {top: 50, right: 20, bottom: 60, left: 210},
    width_3 = 1024 - margin_3.left - margin_3.right,
    height_3 = 768 - margin_3.top - margin_3.bottom;


// append the svg_3 object to the body of the page
const svg_3 = d3.select(id_ref_3)
.append("svg")
.attr("preserveAspectRatio", "xMidYMid meet")
.attr("viewBox", '0 0 ' + (width_3+ margin_3.left + margin_3.right) +
' ' + (height_3 + margin_3.top + margin_3.bottom))
.append("g")
.attr("transform", `translate(${margin_3.left}, ${margin_3.top})`);

// Parse the Data
d3.csv("../../data/comparison/comparison-3.csv").then( function(data) {

    data.sort(function(b, a) {
        return a.Life_expectancy - b.Life_expectancy;
      });

const colorScale = d3.scaleOrdinal()
.range(["#1982c4", "#1982c4", "#1982c4","#1982c4", "#1982c4", "#1982c4","#1982c4", "#1982c4", "#1982c4","#ff595e", "#ff595e", "#ff595e","#ff595e", "#1982c4", "#ff595e","#ff595e", "#ff595e", "#ff595e","#ff595e", "#ff595e"])

// X axis
const x = d3.scaleBand()
  .range([ 0, width_3 ])
  .domain(data.map(d => d.Country))
  .padding(0.2);
svg_3.append("g")
  .attr("transform", `translate(0, ${height_3})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, 90])
  .range([ height_3, 0]);
svg_3.append("g")
  .call(d3.axisLeft(y));

// Bars
svg_3.selectAll("mybar")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.Country))
    //.attr("y", d => y(d.Life_expectancy))
    .attr("width", x.bandwidth())
    //.attr("height", d => height_3 - y(d.Life_expectancy))
    .attr("height", d => height_3 - y(0)) // always equal to 0
    .attr("y", d => y(0))
    .attr("fill",colorScale )
    .attr("opacity" , 0.5);
  svg_3
    .append("line")
    .attr('x1', 0)
    .attr('y1', y(71.6))
    .attr('x2', width_3)
    .attr('y2', y(71.6))
    .attr('stroke', 'green')
    svg_3
    .append("text")
    .attr("x", width_3-300)
    .attr("y", y(80))
    .text("Average Life Expectancy: 71.6 years")
    .style("font-size", "19px")


       // create a tooltip
       const tooltip = d3.select(id_ref_3)
       .append("div")
       .attr("class", "tooltip")
       .style("font-size", "14px")
       .style("background-color", "white")
       .style("border", "solid")
       .style("border-width", "1px")
       .style("border-radius", "5px")
       .style("padding", "10px")
       .style("opacity", 0);

       // Title
    svg_3.append("text")
    .attr("x", ((width_3 - (margin_3.left - margin_3.right)) / 2))             
    .attr("y", 0 - (margin_3.top / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Life expectancy in the top 10 populated developing/developed countries");

// X axis label
svg_3.append("text")      // text label for the x axis
    .attr("x", (width_3 / 2))
    .attr("y", (height_3 + margin_3.bottom))
    .style("class", "h2")
    .style("font-size", "16px")
    .style("text-anchor", "middle")
    .text("Countries");

// Y axis label
svg_3.append("text")      // text label for the y axis
    .attr("x", (-height_3  / 2))
    .attr("y", -50)
    .style("text-anchor", "middle")
    .style("class", "h2")
    .style("font-size", "16px")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy");

// Animation
svg_3.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", function(d) { return y(d.Life_expectancy); })
  .attr("height", function(d) { return height_3 - y(d.Life_expectancy); })
  .delay(function(d,i){return(i*100);})


// Animation and filling of tooltip
svg_3.selectAll("rect")

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

        tooltip.html("<span class='tooltiptext'>" + "<b>Life Expectancy in  "+ d.Country+ " is : " + d.Life_expectancy + " years" + 
                     "</b><br>" + "</span>")
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
    


})
