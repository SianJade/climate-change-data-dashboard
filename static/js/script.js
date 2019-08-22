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



//share of global co2 emissions bubble chart

d3.csv('data/annual-share-of-co2-emissions.csv', function(error, co2ShareData) {

    var co2ShareChart = dc.bubbleChart('#co2_emissions');

    var ndx = crossfilter(co2ShareData);

    countryDim = ndx.dimension(dc.pluck('Entity'));

    var shareOfGlobalCo2 = CountryDim.group().reduceSum(dc.pluck('Global_CO2_emissions_share'));

    co2ShareChart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .dimension(countryDim)
        .group(shareOfGlobalCo2)
        .transitionDuration(500)
        .x(d3.scale.ordinal().domain('Entity'))
        .yAxisLabel("Share of Global co2 Emissions (%)")
        .xAxisLabel("Country")
});




//Atmospheric co2 concentration parts per million (ppm) chart


d3.csv('data/global-co2-concentration-ppm.csv', function(error, co2AtmosphereData) {

    var atmosphericCO2chart = dc.barChart('#co2_ppm_chart');

    var ndx = crossfilter(co2AtmosphereData);

    yearDim = ndx.dimension(dc.pluck('Year'));

    var minDate = yearDim.bottom(1)[0].Year;
    var maxDate = yearDim.top(1)[0].Year;

    var co2ppm = yearDim.group().reduceSum(dc.pluck('CO2_concentration_ppm'));

    atmosphericCO2chart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .dimension(yearDim)
        .group(co2ppm)
        .brushOn(false)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .yAxisLabel("Atmospheric CO2 concentration (parts per million (ppm))")
        .xAxisLabel("Year")
        .render();

});