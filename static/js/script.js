d3.queue()
    .defer(d3.json, 'epa-sea-level.csv')
    .await(countdown);

//countdown

function countdown() {
    var startDate = new Date();
    var endDate = new Date('March 28, 2030 00:00:00'); //11 years from UN report publication date

    var startTime = startDate.getTime();
    var endTime = endDate.getTime();

    var timeRemaining = endTime - startTime;

    var seconds = Math.floor(timeRemaining / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30.44); //average number of days in a month
    var years = Math.floor(months / 12);

    months = months % 12;
    days = Math.floor(days % 30.44);
    hours = hours % 24;
    minutes %= 60;
    seconds %= 60;

    months = (months < 10) ? '0' + months : months;
    days = (days < 10) ? '0' + days : days;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    document.getElementById('years').innerHTML = years;
    document.getElementById('months').innerHTML = months;
    document.getElementById('days').innerHTML = days;
    document.getElementById('hours').innerHTML = hours;
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;

    setTimeout(countdown, 1000);
}

//sea level rise line graph

var sea_level_rise = dc.barChart('#sea_level_rise');

d3.csv("data/epa-sea-level.csv").get(function(error, data) {
    var mycrossfilter = mycrossfilter(data);
    if (error) throw error;

    
            // age dimension
            var yearDimension = mycrossfilter.dimension(function(data) { 
             return data.Year;
            });
       //     var ageGroup = ageDimension.group().reduceCount();

            // gender dimension
            var sea_level_rise_Dimension = mycrossfilter.dimension(function(data) { 
               return data.CSIRO_Adjusted_Sea_Level; 
            });
          //  var genderGroup = genderDimension.group().reduceCount();
            
    var maxRise = d3.max(data, function(d) { return d.CSIRO_Adjusted_Sea_Level; });

    var maxDate = d3.max(data, function(d) { return d.Year; });
    var minDate = d3.min(data, function(d) { return d.Year; });

    sea_level_rise
        d3.width(500)
        d3.width(data.length * 10)
        d3.xAxisLabel('Year')
        d3.yAxisLabel('Sea Level Rise')
        d3.x(d3.scale.linear().domain([minDate,maxDate]))
        d3.elasticY(true);
        d3.elasticX(true);
        d3.dimension(yearDimension);
     //   .group(ageGroup);
    
   sea_level_rise.render();
    //var height = 500;
    //var width = data.length * 10;

/*
    var n = 135; //number of data points

    var y = d3.scaleLinear()
        .domain([0, maxRise])
        .range([height, 0]);

    var x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);
    //   d3.elasticY(true);
    //    d3.elasticX(true);
    var svg = d3.select('#sea_level_rise')
        .append('svg')
        .attr('height', '100%')
        .attr('width', '100%');

    var margin = { left: 50, right: 50, top: 50, bottom: 50 };

    var chartGroup = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.CSIRO_Adjusted_Sea_Level); });

    var line2 = d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Lower_Error_Bound); });

    chartGroup.append("path").attr("d", line(data));
    chartGroup.append("path").attr("d", line2(data)).attr('class', 'line2');

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 2)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis", true)
        .style("text-anchor", "middle")
        .text("Sea Level Rise (mm)");

    chartGroup.append("text")
        .attr("x", 0)
        .attr("y", 500)
        .classed("axis", true)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + width / 2 + ",80)")
        .text("Year");
*/
});