const id_ref_4="#circ"

// Set the dimensions and margins of the graph
const margin_4 = {top: 70, right: 150, bottom: 60, left: 20},
    width_4 = 1024 - margin_4.left - margin_4.right,
    height_4 = 768 - margin_4.top - margin_4.bottom;

// append the svg object to the body of the page
const svg_4 = d3.select(id_ref_4)
  .append("svg")
    .attr("viewBox", '0 0 ' + (width_4 + margin_4.left + margin_4.right) +
            ' ' + (height_4 + margin_4.top + margin_4.bottom))
  .append("g")
    .attr("transform",`translate(${margin_4.left},${margin_4.top})`);

// Read data
d3.csv("../../data/comparison/comparison-4.csv").then( function(data) {

  // Filter a bit the data -> more than 1 million inhabitants
  data = data.filter(function(d){ return d.Population>1000 })

  // Size scale for countries
  const size = d3.scaleLinear()
    .domain([2000, 258162113])
    .range([5,150])  // circle will be between 7 and 55 px wide

  // A scale that gives a X target position for each group
  var x = d3.scaleOrdinal()
    .domain(["Developing", "Developed"])
    .range([-200, 200])

  // create a tooltip
  const tooltip = d3.select(id_ref_4)
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("opacity", 0);

       
  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    d3.select(event.currentTarget)
            .transition("selected")
                .duration(300)
                .style("opacity", 1.0)      
                .style("stroke-width", 2)
                ;

    tooltip.transition("appear-box")
    .duration(300)
    .style("opacity", .9)
    // Added to control the fact that the tooltip disappear if
    // we move between near boxes (horizontally)
    .delay(1);

    tooltip.html("<span class='tooltiptext'>" + "<b>Life Expectancy in  "+ d.Country+ " is : " + d.Life_expectancy + " years old" + "<br> with the population of " + Math.ceil(d.Population)  + " inhabitants" +  
                     "</b><br>" + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
  }
 
  var mouseleave = function(event, d) {
    // MouseOut
        d3.select(event.currentTarget)
           .transition("unselected")
                .duration(300)
                .style("opacity", 0.7)
                .style("stroke-width", 1);

        tooltip.transition("disappear-box")
            .duration(300)
            .style("opacity", 0);
  }

  svg_4.append("text")
    .attr("x", ((width_4 - (margin_4.left - margin_4.right)) / 2))             
    .attr("y", 0 - (margin_4.top / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Countries by Status, Population and Life Expectancy");

    svg_4.append("text")
    .attr("x", ((width_4 - (margin_4.left - margin_4.right)) / 2) - 150)             
    .attr("y", +660)
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "bottom")  
    .style("text-decoration", "underline")  
    .text("Developing");

    svg_4.append("text")
    .attr("x", ((width_4 - (margin_4.left - margin_4.right)) / 2) + 250)             
    .attr("y", +660)
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "bottom")  
    .style("text-decoration", "underline")  
    .text("Developed");
  // Initialize the circle: all located at the center of the svg area
  var node = svg_4.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .on("mouseover", mouseover) // What to do when hovered
      .on("mouseleave", mouseleave)
      .attr("class", "node")
      .attr("r", d => size(d.Population))
      .attr("cx", width_4 / 2)
      .attr("cy", height_4 / 2)
      .style("fill", d => d3.interpolateRdYlGn((d.Life_expectancy-51)/37))
      .style("fill-opacity", 0.8)
      .style("opacity",0.7)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));
  // Features of the forces applied to the nodes:
  const simulation = d3.forceSimulation()
      .force("x", d3.forceX().strength(0.3).x(function(d){ return x(d.Status) }))
      .force("y", d3.forceY().strength(0.2).y( height_4/2 ))
      .force("center", d3.forceCenter().x(width_4 / 2).y(height_4 / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(0.01)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(0.9).radius(function(d){ return (size(d.Population)+3) }).iterations(10)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
      });

  // What happens when a circle is dragged?
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})
