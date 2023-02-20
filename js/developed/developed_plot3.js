const id_ref_3 = "#scatterplot-developed"



//   // Customization
//   //svg_3.selectAll(".tick line").attr("stroke", "#EBEBEB")









const margin_3 = {top: 50, right: 20, bottom: 60, left: 210},
    width_3 = 1024 - margin_3.left - margin_3.right,
    height_3 = 768 - margin_3.top - margin_3.bottom;


// append the svg_3_2 object to the body of the page
const svg_3 = d3.select(id_ref_3)
.append("svg")
.attr("preserveAspectRatio", "xMidYMid meet")
.attr("viewBox", '0 0 ' + (width_3+ margin_3.left + margin_3.right) +
' ' + (height_3 + margin_3.top + margin_3.bottom))
.append("g")
.attr("transform", `translate(${margin_3.left}, ${margin_3.top})`);



//Read the data
d3.csv("../../data/developed/developed3.csv").then( function(data) {
    // Add X axis
    const x = d3.scaleLinear()
    .domain([0, 0])
    .range([ 0, width_3 ]);
    svg_3.append("g")
    .attr("class","myXaxis")
    .attr("transform", `translate(0, ${height_3})`)
    .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 150000000])
    .range([ height_3, 0]);
    svg_3.append("g")
    .call(d3.axisLeft(y));

    svg_3.append("text")
    .attr("x", ((width_3 - (margin_3.left - margin_3.right))  / 2))             
    .attr("y", 0 - (margin_3.top / 2) - 10)
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Relationship between Life Expectancy and Population ");

      // Add X axis label:
  svg_3.append("text")      // text label for the x axis
    .attr("x", (width_3 / 2))
    .attr("y", (height_3 - 10 +  margin_3.bottom))
    .style("class", "h2")
    .style("font-size", "18px")
    .style("text-anchor", "middle")
    .text("Life Expectancy");

      // Y axis label:
  svg_3.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin_3.left + 100)
      .attr("x", -margin_3.top - 200)
      .text("Population")



 

      //   // Color scale: give me a specie name, I return a color
   var color = d3.scaleOrdinal()
     .domain(["Australia", "Austria", "Belgium" , "Bulgaria", "Croatia" , "Cyprus", "Czechia", "Denmark" , "Germany" , "Hungary" , "Iceland" , "Ireland" , "Italy" , "Japan" , "Latvia" , "Lithuania", "Luxembourg" , "Malta" , "Netherlands" ,"New Zealand", "Norway" , "Poland" , "Portugal" , "Romania" , "Singapore" , "Slovakia" , "Slovenia" , "Spain" , "Sweden" , "Switzerland" , "United Kingdom of Great Britain and Northern Ireland", "United States of America"  ])
     .range([ "#402D54", "#D18975", "#8FD175", "#00ffff", "#000000", "#0000ff", "#ff00ff", "#808080", "#008000", "#	#00ff00", "#800000", "	#000080", "#808000", "#808000", "	#ff0000", "#c0c0c0", "	#008080", "	#ffff00", "#d2691e", "#8b008b", "	#8b0000", "	#ffd700", "#add8e6", "#dda0dd", "#deb887", "#a9a9a9", "#f0e68c", "#ffc0cb", "#9370db", "#C03040", "#FFFFA0", "D050805"])


//TOOLTIP

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






    // Add dots
    svg_3.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
        .attr("cx", function (d) { return x(d.Life_expectancy); } )
        .attr("cy", function (d) { return y(d.Population); } )
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .style("fill", function (d) { return color(d.Country) } )
        .attr("stroke", "black")
       

        svg_3.selectAll("circle")

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

        tooltip.html("<span class='tooltiptext'>" + "<b>Life Expectancy in  "+ d.Country+ " is : " + d.Life_expectancy + " years" + " with the population of " + Math.ceil(d.Population)  + " inhabitants" +  
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

    x.domain([70, 90])
    svg_3.select(".myXaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisBottom(x));
  
    svg_3.selectAll("circle")
      .transition()
      .delay(function(d,i){return(i*300)})
      .duration(2000)
      .attr("cx", function (d) { return x(d.Life_expectancy); } )
      .attr("cy", function (d) { return y(d.Population); } )
       

})