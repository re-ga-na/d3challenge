// set width and height
var svgWidth = 960;
var svgHeight = 500;

//set margins
var margin = {
  top: 60,
  bottom: 100,
  right: 40,
  left: 100
};
// chart area dimensions
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG area appended to wrapper, set dimensions
var chart = d3.select("#scatter")
    .append("div")
    .classed("chart", true);

var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load CSV data 
d3.csv("./assets/data/data.csv").then(function(censusData) {
    console.log(censusData);
  
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });
    //linear scale
    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0]);

    // chart axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(censusData, function(data) {
        return data.healthcare;
    });

    xMax = d3.max(censusData, function(data) {
        return data.healthcare;
    });

    yMin = d3.min(censusData, function(data) {
        return data.poverty;
    });

    yMax = d3.max(censusData, function(data) {
        return data.poverty;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis)

    //Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare +1.5))
    .attr("cy", d => yLinearScale(d.poverty +0.3))
    .attr("r", "11")
    .attr("fill", "blue")
    .attr("opacity", .5)
  
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    // Init tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return(abbr + '%')
            });
            
    // call tooltip
    circlesGroup.call(toolTip);

    // mouseover and mouseout event listeners
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
        .on("mouseout", function(data) {
          toolTip.hide(data);
        });

    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(censusData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.healthcare +1.3);
        })
        .attr("y", function(data) {
            return yLinearScale(data.poverty +.1);
        })
        .text(function(data) {
            return data.abbr
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    });