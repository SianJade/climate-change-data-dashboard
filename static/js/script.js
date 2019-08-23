queue()
    .defer(d3.csv, 'data/epa-sea-level.csv')
    .await(countdown);

//countdown

function countdown() {
    let deadline = 'March 28, 2030 00:00:00'; //11 years from UN report publication date
    let startDate = new Date();
    let endDate = new Date(deadline);

    let startTime = startDate.getTime();
    let endTime = endDate.getTime();

    let timeRemaining = endTime - startTime;

    let seconds = Math.floor(timeRemaining / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 30.44); //average number of days in a month
    let years = Math.floor(months / 12);

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

d3.csv("data/epa-sea-level.csv", function(error, seaData) {
    
    let seaLevelRiseChart = dc.lineChart('#sea_level_rise');

    let ndx = crossfilter(seaData);

    let yearDim = ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let averageRise = yearDim.group().reduceSum(dc.pluck('CSIRO_Adjusted_Sea_Level'));
    let lowerErrorBound = yearDim.group().reduceSum(dc.pluck('Lower_Error_Bound'));
    let upperErrorBound = yearDim.group().reduceSum(dc.pluck('Upper_Error_Bound'));

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

d3.csv("data/global-temperature-rise.csv", function(error, tempData) {
    
    let tempRiseChart = dc.compositeChart('#temperature_rise');

    let ndx = crossfilter(tempData)

    yearDim = ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

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

    let globalRise = yearDim.group().reduceSum(riseByLocation('Global'));
    let northernRise = yearDim.group().reduceSum(riseByLocation('Northern_Hemisphere'));
    let southernRise = yearDim.group().reduceSum(riseByLocation('Southern_Hemisphere'));
    let tropicsRise = yearDim.group().reduceSum(riseByLocation('Tropics'));

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

    let co2ShareChart = dc.bubbleChart('#co2_emissions');

    let ndx = crossfilter(co2ShareData);

    countryDim = ndx.dimension(dc.pluck('Entity'));
    
    let AFG = countryDim.top(1)[0].Entity;
    let ZWE = countryDim.bottom(1)[0].Entity;

    let shareOfGlobalCo2 = countryDim.group().reduceSum(dc.pluck('Global_CO2_emissions_share'));
    
    co2ShareChart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .dimension(countryDim)
        .group(shareOfGlobalCo2)
        .x(d3.scale.ordinal().domain(AFG,ZWE))
        .y(d3.scale.linear().domain([1,100]))
        .r(d3.scale.linear().domain([0,100]))
        .renderLabel(true)
        .renderHorizontalGridLines(true)
        .maxBubbleRelativeSize(0.8)
        .render();
});



//Atmospheric co2 concentration parts per million (ppm) chart


d3.csv('data/global-co2-concentration-ppm.csv', function(error, co2AtmosphereData) {

    let atmosphericCO2chart = dc.barChart('#co2_ppm_chart');

    let ndx = crossfilter(co2AtmosphereData);

    yearDim = ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let co2ppm = yearDim.group().reduceSum(dc.pluck('CO2_concentration_ppm'));

    atmosphericCO2chart
        .width(1000)
        .height(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .brushOn(false)
        .yAxisLabel("Atmospheric CO2 concentration (parts per million (ppm))")
        .xAxisLabel("Year")
        .dimension(yearDim)
        .group(co2ppm)
        .render();
});