// @TODO: YOUR CODE HERE!
//Creating svg and mapping chart area
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//importing csv
var file = "assets/data/data.csv"

d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error) {
    throw err;
}

function successHandle(statesData) {

    statesData.map(function (data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    //creating x and y scales 
    var xLinearScale = d3.scaleLinear()
        .domain([8.0, d3.max(statesData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(statesData, d => d.obesity)])
        .range([height, 0]);

    //creating bottom and left axis 
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale);

//appending attributes to chart group
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

//creating circles for scatter plot
var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#556fb2")
    .attr("opacity", ".50")

//adding text to circles 
var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

//creating tool tip
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([70, -70])
    .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
    });

chartGroup.call(toolTip);

//creating event listener
circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
})
    .on("mouseout", function (data) {
        toolTip.hide(data);
    });

//creating axis labels
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0-margin.left+40)
    .attr("x", 0-(height/2))
    .text("Obese (%)");

chartGroup.append("text")
    .attr("transform",`translate(${width/2.5}, ${height+margin.top+20})`)
    .text("In Poverty (%)");
}
