queue()
    .defer(d3.json, 'data/epa-sea-level.csv')
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

//sea level rise line graph//
var seaLevelRiseChart = dc.lineChart('#sea_level_rise');

d3.csv("data/epa-sea-level.csv", function(error, seaData) {

    var ndx = crossfilter(seaData);

    var yearDim = ndx.dimension(dc.pluck('Year'));

    var minDate = yearDim.bottom(1)[0].Year;
    var maxDate = yearDim.top(1)[0].Year;

    var averageRise = yearDim.group().reduceSum(dc.pluck('CSIRO_Adjusted_Sea_Level'));
    var lowerErrorBound = yearDim.group().reduceSum(dc.pluck('Lower_Error_Bound'));
    var upperErrorBound = yearDim.group().reduceSum(dc.pluck('Upper_Error_Bound'));

    seaLevelRiseChart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .dimension(yearDim)
        .group(averageRise, 'CSIRO Adjusted Sea Level Rise')
        .stack(lowerErrorBound, 'Lower Error Bound')
        .stack(upperErrorBound, 'Upper Error Bound')
        .xyTipsOn(true)
        .legend(dc.legend().x(750).y(50).itemHeight(10).gap(10))
        .brushOn(false)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .yAxisLabel("Global Sea Level Rise (mm)")
        .xAxisLabel("Year")
        .render();
});


//global temperature rise chart//
var tempRiseChart = dc.compositeChart('#temperature_rise');

d3.csv("data/global-temperature-rise.csv", function(error, tempData) {

    var ndx = crossfilter(tempData)

    yearDim = ndx.dimension(dc.pluck('Year'));

    var minDate = yearDim.bottom(1)[0].Year;
    var maxDate = yearDim.top(1)[0].Year;

    function riseByLocation(Entity) {
        return function(d) {
            if (d.Entity === Entity) {
                return d.Median;
            }
            else {
                return 0;
            }
        }
    }

    var globalRise = yearDim.group().reduceSum(riseByLocation('Global'));
    var northernRise = yearDim.group().reduceSum(riseByLocation('Northern_Hemisphere'));
    var southernRise = yearDim.group().reduceSum(riseByLocation('Southern_Hemisphere'));
    var tropicsRise = yearDim.group().reduceSum(riseByLocation('Tropics'));

    tempRiseChart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .legend(dc.legend().x(650).y(50).itemHeight(10).gap(10))
        .dimension(yearDim)
        .brushOn(false)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .yAxisLabel("Average temperature rise (°F)")
        .xAxisLabel("Year")
        .compose([
            dc.lineChart(tempRiseChart)
            .colors('red')
            .group(globalRise, 'Global average temperature rise'),
            dc.lineChart(tempRiseChart)
            .colors('blue')
            .group(northernRise, 'Northern Hemisphere average temperature rise'),
            dc.lineChart(tempRiseChart)
            .colors('green')
            .group(southernRise, 'Southern Hemisphere average temperature rise'),
            dc.lineChart(tempRiseChart)
            .colors('yellow')
            .group(tropicsRise, 'Tropics average temperature rise')
        ])
        .render();
    dc.renderAll();
});

//co2 emissions pie chart
//var co2Chart = dc.pieChart('#co2_emissions');

d3.csv('data/annual-share-of-co2-emissions.csv', function(error, co2Data) {

    var ndx = crossfilter(co2Data);

    countryDim = ndx.dimension(dc.pluck('Entity'));

    var ninetySeven = co2Data.filter(function(d) {
        if (d.Year === '1997' && d.Global_CO2_emissions_share >= '1') return d.Entity;
    });
    
    var zeroSeven = co2Data.filter(function(d) {
        if (d.Year === '2007' && d.Global_CO2_emissions_share >= '1') return d.Entity;
    });
    
    var twentySeventeen = co2Data.filter(function(d) {
        if (d.Year === '2017' && d.Global_CO2_emissions_share >= '1') return d.Entity;
    });
    
    console.log(ninetySeven,zeroSeven,twentySeventeen);
    
    
    
});