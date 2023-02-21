
const id_ref_4 = "#timeline-developing"

// Set the dimensions and margins of the graph
const margin_4 = {top: 50, right: 20, bottom: 60, left: 210},
    width_4 = 1024 - margin_4.left - margin_4.right,
    height_4 = 768 - margin_4.top - margin_4.bottom;


// append the svg_2 object to the body of the page
const svg_4 = d3.select(id_ref_4)
.append("svg")
.attr("preserveAspectRatio", "xMidYMid meet")
.attr("viewBox", '0 0 ' + (width_4+ margin_4.left + margin_4.right) +
' ' + (height_4 + margin_4.top + margin_4.bottom))
.append("g")
.attr("transform", `translate(${margin_4.left}, ${margin_4.top})`);



d3.csv("../../data/developing/developing4.csv").then (function(data) {

    // List of groups (here I have one group per column)
    const allGroup = new Set(data.map(d => d.Country))

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.Year; }))
      .range([ 0, width_4 ]);
    svg_4.append("g")
      .attr("transform", "translate(0," + height_4 + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([30, d3.max(data, function(d) { return +d.Life_expectancy; }) + 5])
      .range([ height_4, 0 ]);
    svg_4.append("g")
      .call(d3.axisLeft(y).ticks(15));


            // Add X axis label:
  svg_4.append("text")      // text label for the x axis
  .attr("x", (width_4 / 2))
  .attr("y", (height_4 - 10 +  margin_4.bottom))
  .style("class", "h2")
  .style("font-size", "18px")
  .style("text-anchor", "middle")
  .text("Years");

    // Y axis label:
svg_4.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin_4.left + 150)
    .attr("x", -margin_4.top - 200)
    .text("Life Expectancy")

     //TOOLTIP

const tooltip = d3.select(id_ref_4)
.append("div")
.attr("class", "tooltip")
.style("font-size", "14px")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "10px")
.style("opacity", 0);

svg_4.append("text")
.attr("x", ((width_4 - (margin_4.left - margin_4.right))  / 2))             
.attr("y", 0 - (margin_4.top / 2) +10)
.style("class", "h2")
.style("font-size", "18px")
.attr("text-anchor", "middle")  
.style("text-decoration", "underline")  
.text("Timeline Life Expectancy of the Desired Developing Country");


    // Initialize line with first group of the list
    const line = svg_4
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.Country == "Afghanistan"}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.Year) })
          .y(function(d) { return y(+d.Life_expectancy) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")

         // Initialize dots with group a
    const dot = svg_4
    .selectAll('circle')
    .data(data.filter(function(d){return d.Country == "Afghanistan"}))
    .join('circle')
      .attr("cx", d => x(+d.Year))
      .attr("cy", d => y(+d.Life_expectancy))
      .attr("r", 7)
      .style("fill", "#000000")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      const dataFilter = data.filter(function(d){return d.Country==selectedGroup})

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(+d.Life_expectancy) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })

          dot
          .data(dataFilter)
          .transition()
          .duration(1000)
          .attr("cx", d => x(+d.Year))
          .attr("cy", d => y(+d.Life_expectancy))
          .attr("stroke", function(d){ return myColor(selectedGroup) })
          
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

    
    svg_4.selectAll("circle")
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

        tooltip.html("<span class='tooltiptext'>" + "<b>Life Expectancy during  " + d.Year + " <br> was " +  d.Life_expectancy  + " years old" +
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