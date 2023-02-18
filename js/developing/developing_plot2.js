const id_ref_2 = "#developing_2"

const boxSize_2 = 40
const legend_sep_2 = -150

// set the dimensions and margin_2s of the graph
const margin_2 = {top: 50, right: 20, bottom: 60, left: 100},
    width_2 = 1024 - margin_2.left - margin_2.right,
    height_2 = 768 - margin_2.top - margin_2.bottom;

// append the svg_2 object to the body of the page
const svg_2 = d3.select(id_ref_2)
  .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", '0 0 ' + (width_2 + margin_2.left + margin_2.right) +
            ' ' + (height_2 + margin_2.top + margin_2.bottom))
    // .attr("width", width_2 + margin_2.left + margin_2.right)
    // .attr("height", height_2 + margin_2.top + margin_2.bottom)
  .append("g")
    .attr("transform",`translate(${margin_2.left},${margin_2.top})`);

// Parse the Data
d3.csv("../../data/developing/developing-2.csv").then( function(data) {

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(2)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.Country)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width_2])
      .padding([0.2])
      
  svg_2.append("g")
    .attr("transform", `translate(0, ${height_2})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "12px");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height_2, 0 ]);
  svg_2.append("g")
    .call(d3.axisLeft(y));

// Create a tooltip
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

  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Show the bars
  svg_2.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${x(d.Country)}, 0)`)
    .selectAll("rect")
    .data(function(d) { 
        return subgroups.map(function(key) { return {key: key, value: d[key], country: d.Country, pop: d.Population}; }); })
    .join("rect")
      .attr("x", d => xSubgroup(d.key))
    //   .attr("y", d => y(d.value))
      .attr("width", xSubgroup.bandwidth())
    //   .attr("height", d => height_2 - y(d.value))
      .attr("y", d => y(0))
      .attr("height", d => height_2 - y(0))
      .attr("class", function (d) {
        const type_2 = d3.select(this.parentNode).datum().key  
        return "class" + subgroups.indexOf(type_2);
        })
      .attr("fill", d => color(d.key))
      .attr("opacity", 0.5);

    // Title
    svg_2.append("text")
    .attr("x", ((width_2 - (margin_2.left - margin_2.right)) / 2))             
    .attr("y", 0 - (margin_2.top / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Immunization coverage among 1-year-olds (%) per most populated Developing Countries");

    // Y axis label
    svg_2.append("text")      // text label for the y axis
    .attr("x", (-height_2 / 2))
    .attr("y", -40)
    .style("text-anchor", "middle")
    .style("class", "h2")
    .style("font-size", "16px")
    .attr("transform", "rotate(-90)")
    .text("Immunization coverage among 1-year-olds (%)");

    // Animation
    svg_2.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", d => y(d.value))
    .attr("height", d => height_2 - y(d.value))
    .delay((d,i) => {return i*100})

    var legend_2 = svg_2.join("g")
    .selectAll("legend_2")
    .data(subgroups);

    legend_2.join("rect")
    .attr("x", width_2 + legend_sep_2)
    .attr("y", (d, i) => i * boxSize_2 + 5)
    .attr("width", boxSize_2 - 3)
    .attr("height", boxSize_2 - 3)
    .attr("class", d => "class"+subgroups.indexOf(d))
    .attr("fill", (d) => color(d))
    .attr("opacity", 0.5)
    .attr("tag", "legend_2");

    legend_2.join("text")
    .attr("x", width_2 + legend_sep_2 )
    .attr("y", (d, i) => i * boxSize_2 + 5)
    .append("tspan")
    .attr("dx", -5)
    .attr("dy", boxSize_2 / 2 + 5)
    .attr("class", d => "class"+subgroups.indexOf(d))
    .text((d) => d)
    .style("fill",(d) => color(d))
    .style("font-size", "14px")
    .style("text-anchor", "end")
    .attr("opacity", 0.5)
    .attr("tag", "legend_2");

    // Animation and filling of tooltip
    svg_2.selectAll("rect")
    
    // MouseOver
    .on("mouseover", function (event, d) {

        const type_2 = d3.select(this.parentNode).datum().key
        d3.select(event.currentTarget)
        .transition("selected")
        .duration(300)
        .style("opacity", 1.0);

        class_of_interest = event.currentTarget.classList[0]
        svg_2.selectAll(`rect.${class_of_interest}[tag='legend_2'],
                         tspan.${class_of_interest}[tag='legend_2']`)
        .transition("selected")
        .duration(300)
        .style("opacity", 1.0);

        tooltip.transition("appear-box")
        .duration(300)
        .style("opacity", .9)
        // Added to control the fact that the tooltip disappear if
        // we move between near boxes (horizontally)
        .delay(1);

        tooltip.html("<span class='tooltiptext'>" + "<b>Immunization coverage: " + d.value + 
                        "</b><br>" + "Type of immunization: "+ d.key + 
                        "</b><br>" + "Country: "+ d.country + 
                        "</b><br>" + "Population: "+ +d.pop + "</span>")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    
    // MouseOut
    .on("mouseout", function (event, d) {

        d3.select(event.currentTarget)
        .transition("unselected")
        .duration(300)
        .style("opacity", 0.5);  

        class_of_interest = event.currentTarget.classList[0]
        svg_2.selectAll(`rect.${class_of_interest}[tag='legend_2'], 
                         tspan.${class_of_interest}[tag='legend_2']`)
        .transition("selected")
        .duration(300)
        .style("opacity", 0.5);

        tooltip.transition("disappear-box")
        .duration(300)
        .style("opacity", 0);
    });
        
    svg_2.join("g").selectAll("rect[tag='legend_2']")
    .on("mouseover", function (event, d) {
        idx = subgroups.indexOf(d);
        svg_2.selectAll(`.class${idx}`)
        .transition("selected")
        .duration(300)
        .style("opacity", 1.0);
    })
    .on("mouseout", function (event, d){
        idx = subgroups.indexOf(d);
        svg_2.selectAll(`.class${idx}`)
        .transition("unselected")
        .duration(300)
        .style("opacity", 0.5);
    })
})
