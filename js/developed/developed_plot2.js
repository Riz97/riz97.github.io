const id_ref_2 = "#circularbar-developed"

// Set the dimensions and margins of the graph
const margin_2 = {top: 50, right: 20, bottom: 60, left: 210},
    width_2 = 1024 - margin_2.left - margin_2.right,
    height_2 = 768 - margin_2.top - margin_2.bottom;


// append the svg_2 object to the body of the page
const svg_2 = d3.select(id_ref_2)
.append("svg")
.attr("preserveAspectRatio", "xMidYMid meet")
.attr("viewBox", '0 0 ' + (width_2+ margin_2.left + margin_2.right) +
' ' + (height_2 + margin_2.top + margin_2.bottom))
.append("g")
.attr("transform", `translate(${margin_2.left}, ${margin_2.top})`);

// Parse the Data
d3.csv("../../data/developed/developed1-2.csv").then( function(data) {

    data.sort(function(b, a) {
        return a.Life_expectancy - b.Life_expectancy;
      });

// X axis
const x = d3.scaleBand()
  .range([ 0, width_2 ])
  .domain(data.map(d => d.Country))
  .padding(0.2);
svg_2.append("g")
  .attr("transform", `translate(0, ${height_2})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, 90])
  .range([ height_2, 0]);
svg_2.append("g")
  .call(d3.axisLeft(y));

// Bars
svg_2.selectAll("mybar")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.Country))
    //.attr("y", d => y(d.Life_expectancy))
    .attr("width", x.bandwidth())
    //.attr("height", d => height_2 - y(d.Life_expectancy))
    .attr("height", d => height_2 - y(0)) // always equal to 0
    .attr("y", d => y(0))
    .attr("fill", "#69b3a2")
    .attr("opacity" , 0.5);


       // create a tooltip
       const tooltip = d3.select(id_ref_2)
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
    svg_2.append("text")
    .attr("x", ((width_2 - (margin_2.left - margin_2.right)) / 2))             
    .attr("y", 0 - (margin_2.top / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Life Expectancy  for Developed Countries");

// X axis label
svg_2.append("text")      // text label for the x axis
    .attr("x", (width_2 / 2))
    .attr("y", (height_2 + margin_2.bottom))
    .style("class", "h2")
    .style("font-size", "16px")
    .style("text-anchor", "middle")
    .text("Countries");

// Y axis label
svg_2.append("text")      // text label for the y axis
    .attr("x", (-height_2  / 2))
    .attr("y", -50)
    .style("text-anchor", "middle")
    .style("class", "h2")
    .style("font-size", "16px")
    .attr("transform", "rotate(-90)")
    .text("Life Exepctancy");

// Animation
svg_2.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", function(d) { return y(d.Life_expectancy); })
  .attr("height", function(d) { return height_2 - y(d.Life_expectancy); })
  .delay(function(d,i){return(i*100);})


// Animation and filling of tooltip
svg_2.selectAll("rect")

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
