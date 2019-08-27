queue()
    .defer(d3.csv, 'data/epa-sea-level.csv')
    .defer(d3.csv, 'data/global-temperature-rise.csv')
    .defer(d3.csv, 'data/annual-share-of-co2-emissions.csv')
    .defer(d3.csv, 'data/global-co2-concentration-ppm.csv')
    .defer(d3.csv, 'data/global-deforestation.csv')
    .await(makeGraphs);
    
function makeGraphs(error, seaData, tempData, co2ShareData, co2AtmosphereData){
let sea_ndx = crossfilter(seaData);
let temp_ndx = crossfilter(tempData);
let co2_share_ndx = crossfilter(co2ShareData);
let atmosphere_ndx = crossfilter(co2AtmosphereData);

buildSeaGraph(sea_ndx);
buildTempGraph(temp_ndx);
buildCo2ShareGraph(co2_share_ndx);
buildCo2PpmGraph(atmosphere_ndx);
showYearSelector(co2_share_ndx);

dc.renderAll();

}

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

countdown();

//sea level rise line graph//

function buildSeaGraph(sea_ndx) {
    
    let yearDim = sea_ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let averageRise = yearDim.group().reduceSum(dc.pluck('CSIRO_Adjusted_Sea_Level'));
    let lowerErrorBound = yearDim.group().reduceSum(dc.pluck('Lower_Error_Bound'));
    let upperErrorBound = yearDim.group().reduceSum(dc.pluck('Upper_Error_Bound'));

    dc.lineChart('#sea_level_rise')
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
};




//global temperature rise chart//
let tempRiseChart = dc.compositeChart('#temperature_rise')

function buildTempGraph(temp_ndx) {

    yearDim = temp_ndx.dimension(dc.pluck('Year'));

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
}


//year selector for co2 share graph

function showYearSelector(co2_share_ndx){
    dim = co2_share_ndx.dimension(dc.pluck('Year'));
    group = dim.group();
    
    dc.selectMenu('#year_selector')
        .dimension(dim)
        .group(group);
}

//share of global co2 emissions bubble chart

function buildCo2ShareGraph(co2_share_ndx) {

    countryDim = co2_share_ndx.dimension(dc.pluck('Entity'));

    let AFG = countryDim.top(1)[0].Entity;
    let ZWE = countryDim.bottom(1)[0].Entity;

    let shareOfGlobalCo2 = countryDim.group().reduceSum(dc.pluck('Global_CO2_emissions_share'));

    dc.bubbleChart('#co2_emissions')
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .dimension(countryDim)
        .group(shareOfGlobalCo2)
        .x(d3.scale.ordinal().domain([countryDim.top(1)[0], countryDim.bottom(1)[0]]))
        .y(d3.scale.linear().domain([1, 100]))
        .r(d3.scale.linear().domain([0, 100]))
        .renderLabel(true)
        .renderHorizontalGridLines(true)
        .maxBubbleRelativeSize(0.8)
}



//Atmospheric co2 concentration parts per million (ppm) chart


function buildCo2PpmGraph(atmosphere_ndx) {

    yearDim = atmosphere_ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let co2ppm = yearDim.group().reduceSum(dc.pluck('CO2_concentration_ppm'));

    dc.barChart('#co2_ppm_chart')
        .width(1000)
        .height(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .brushOn(false)
        .yAxisLabel("Atmospheric CO2 concentration (parts per million (ppm))")
        .xAxisLabel("Year")
        .dimension(yearDim)
        .group(co2ppm)
}