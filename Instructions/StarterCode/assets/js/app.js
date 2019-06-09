// Define SVG area dimensions
var svgWidth = 860;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

var shift = 10;

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("data.csv").then(function (stateData) {

  // Print the data
  console.log(stateData);

  // Cast the poverty value to a number for each piece of data
  stateData.forEach((data) => {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  //create scales for axes
  var xScale = d3.scaleLinear()
    .domain([(d3.min(stateData, d => d.poverty)), (d3.max(stateData, d => d.poverty))])
    .range([0, chartWidth]);

  var yScale = d3.scaleLinear()
    .domain([(d3.min(stateData, d => d.healthcare)), (d3.max(stateData, d => d.healthcare))])
    .range([chartHeight, 0]);

  //create axes
  var xAxis = d3.axisBottom(xScale)
    .ticks(10);
  var yAxis = d3.axisLeft(yScale)
    .ticks(10);

  //Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(${shift}, ${chartHeight-shift})`)
    .call(xAxis);

  chartGroup.append("g")
  .attr("transform", `translate(${shift}, ${-shift})`)
    .call(yAxis);

  // Create circles for scatterplot
  var circles = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty)+shift)
    .attr("cy", d => yScale(d.healthcare)-shift)
    .attr("r", "8")
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("opacity", "0.75");

  var circlesText = chartGroup.selectAll("text#circletext")
    .data(stateData)
    .enter()
    .append("text")
    .attr("id", "circletext")
    .attr("x", d => xScale(d.poverty)+shift)
    .attr("y", d => yScale(d.healthcare)-shift)
    .style("font-size", "7px")
    .attr('text-anchor', 'middle')
    .style("fill", "black")
    .text(d => (d.abbr));

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

      chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top - shift})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

});


