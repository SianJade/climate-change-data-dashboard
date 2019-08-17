queue()
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
var seaLevelRiseChart = dc.compositeChart('#sea_level_rise');

d3.csv("data/epa-sea-level.csv", function(error,data) {

    var ndx = crossfilter(data);

    var yearDim = ndx.dimension(dc.pluck('Year'));

    var minDate = yearDim.bottom(1)[0].date;
    var maxDate = yearDim.top(1)[0].date;

    var maxRise = d3.max(data, function(d) { return d.CSIRO_Adjusted_Sea_Level; });

    adjustedGroup = yearDim.group().reduceSum(dc.pluck('CSIRO_Adjusted_Sea_Level'));
    lowerErrorGroup = yearDim.group().reduceSum(dc.pluck('Lower_Error_Bound'));
    upperErrorGroup = yearDim.group().reduceSum(dc.pluck('Upper_Error_Bound'));

    seaLevelRiseChart.width(500)
        .height(500)
        .x(d3.scale.linear().domain([minDate,maxDate]))
        .yAxisLabel("Global Sea Level Rise (mm)")
        .xAxisLabel("Year")
        .legend(dc.legend().x(80).y(20).itemHeight(15).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(seaLevelRiseChart)
            .dimension(yearDim)
            .group(adjustedGroup)
            .colors('red'),
            dc.lineChart(seaLevelRiseChart)
            .dimension(yearDim)
            .group(lowerErrorGroup)
            .colors('blue'),
            dc.lineChart(seaLevelRiseChart)
            .dimension(yearDim)
            .group(upperErrorGroup)
            .colors('yellow')
        ])
        .render();
});
