queue()
    .defer(d3.csv, 'data/epa-sea-level.csv')
    .defer(d3.csv, 'data/global-temperature-rise.csv')
    .defer(d3.csv, 'data/annual-share-of-co2-emissions.csv')
    .defer(d3.csv, 'data/global-co2-concentration-ppm.csv')
    .defer(d3.csv, 'data/global-deforestation.csv')
    .defer(d3.csv, 'data/uk-forest-maintenance.csv')
    .defer(d3.csv, 'data/renewable-energy.csv')
    .defer(d3.csv, 'data/renewable-continents.csv')
    .await(makeGraphs);


function makeGraphs(error, seaData, tempData, co2ShareData, co2AtmosphereData,
    deforestationData, reforestationData, renewableEnergyData, continentalRenewableEnergyData) {

    co2ShareData.forEach(function(d) {
        d.Global_CO2_emissions_share = parseFloat(d.Global_CO2_emissions_share);
    });

    let sea_ndx = crossfilter(seaData);
    let temp_ndx = crossfilter(tempData);
    let co2_share_ndx = crossfilter(co2ShareData);
    let atmosphere_ndx = crossfilter(co2AtmosphereData);
    let deforestation_ndx = crossfilter(deforestationData);
    let reforestation_ndx = crossfilter(reforestationData);
    let renewable_ndx = crossfilter(renewableEnergyData);
    let continent_ndx = crossfilter(continentalRenewableEnergyData);

    buildSeaGraph(sea_ndx);
    buildTempGraph(temp_ndx);
    buildCo2ShareGraph(co2_share_ndx);
    buildCo2PpmGraph(atmosphere_ndx);
    buildDeforestationGraph(deforestation_ndx);
    buildReforestationGraph(reforestation_ndx);
    buildRenewableEnergyTypeGraph(renewable_ndx);
    buildRenewableEnergyContinentGraph(continent_ndx);
    // showYearSelector(reforestation_ndx);

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
}




//global temperature rise chart//

function buildTempGraph(temp_ndx) {

    let tempRiseChart = dc.compositeChart('#temperature_rise');

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


//share of global co2 emissions bubble chart

function buildCo2ShareGraph(co2_share_ndx) {

    let countryDim = co2_share_ndx.dimension(dc.pluck('Entity'));

    let totalEmissionsByCountry = countryDim.group().reduce(

        //add a data entry
        function(p, v) {
            p.count++;
            p.total += v.Global_CO2_emissions_share;
            p.average = p.total / p.count;
            if (p.min > v.Global_CO2_emissions_share) { p.min = v.Global_CO2_emissions_share }
            if (p.max < v.Global_CO2_emissions_share) { p.max = v.Global_CO2_emissions_share }
            return p;
        },
        // Remove a Fact
        function(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            }
            else {
                p.total -= v.Global_CO2_emissions_share;
                p.average = p.total / p.count;
                if (p.min > v.Global_CO2_emissions_share) { p.min = v.Global_CO2_emissions_share }
                if (p.max < v.Global_CO2_emissions_share) { p.max = v.Global_CO2_emissions_share }
            }
            return p;
        },
        // Initialise the Reducer
        function() {
            return { count: 0, total: 0, average: 0, min: 100, max: 0 };
        }
    );



    console.log(totalEmissionsByCountry.all());


    // dc.bubbleChart('#co2_emissions')
    //     .width(1000)
    //     .height(500)
    //     .margins({ top: 50, right: 50, bottom: 50, left: 50 })
    //     .dimension(totalEmissionsByCountry)
    //     .group(totalEmissionsByCountry)
    //     .x(d3.scale.linear([0,100]))
    //     .y(d3.scale.linear().domain([1, 100]))
    //     .r(d3.scale.linear().domain([0, 100]))
    //     .renderLabel(true)
    //     .renderHorizontalGridLines(true)
    //     .maxBubbleRelativeSize(0.8)
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
        .y(d3.scale.linear().domain([300, 420]))
        .brushOn(false)
        .yAxisLabel("Atmospheric CO2 concentration (parts per million (ppm))")
        .xAxisLabel("Year")
        .dimension(yearDim)
        .group(co2ppm)
}


// function showCountrySelector(deforestation_ndx){
//     dim = deforestation_ndx.dimension(dc.pluck('Entity'));
//     group = dim.group();

//     dc.selectMenu('#country_selector')
//         .dimension(dim)
//         .group(group);
// }

//global deforestation chart

function buildDeforestationGraph(deforestation_ndx) {

    yearDim = deforestation_ndx.dimension(dc.pluck('Year'));

    let defaultGroup = yearDim.group().reduceSum(dc.pluck('World'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    dc.barChart('#global_deforestation_chart')
        .width(1000)
        .height(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .brushOn(false)
        .yAxisLabel("Tree coverage")
        .xAxisLabel("Year")
        .dimension(yearDim)
        .group(defaultGroup)
        .yAxis().ticks(10);
}

// function showYearSelector(reforestation_ndx) {
//     dim = reforestation_ndx.dimension(dc.pluck('Year'));
//     group = dim.group();

//     dc.selectMenu('#year_selector')
//         .dimension(dim)
//         .group(group);
// }

//reforestation chart

function buildReforestationGraph(reforestation_ndx) {

    let countryDim = reforestation_ndx.dimension(dc.pluck('Entity'));

    let newConifers = countryDim.group().reduceSum(dc.pluck('new_planting_conifers'));
    let newBroadleaves = countryDim.group().reduceSum(dc.pluck('new_planting_broadleaves'));
    let restockConifers = countryDim.group().reduceSum(dc.pluck('restocking_conifers'));
    let restockBroadleaves = countryDim.group().reduceSum(dc.pluck('restocking_broadleaves'));

    dc.scatterPlot('#reforestation_chart')
        .width(1000)
        .height(500)
        .x(d3.scale.linear().domain([0, 20]))
        .y(d3.scale.linear().domain([0, 20]))
        .brushOn(false)
        .xAxisLabel('Broadleaves')
        .yAxisLabel('Conifers')
        .symbolSize(8)
        .clipPadding(10)
        .dimension(countryDim)
        .group(newConifers);

}

//renewable energy chart

function buildRenewableEnergyTypeGraph(renewable_ndx) {

    let renewableEnergyChart = dc.barChart('#renewable_chart');

    yearDim = renewable_ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let hydropower = yearDim.group().reduceSum(dc.pluck('Hydropower'));
    let marineEnergy = yearDim.group().reduceSum(dc.pluck('Marine_energy'));
    let windEnergy = yearDim.group().reduceSum(dc.pluck('Wind_energy'));
    let solarEnergy = yearDim.group().reduceSum(dc.pluck('Solar_energy'));
    let bioEnergy = yearDim.group().reduceSum(dc.pluck('Bioenergy'));
    let geothermalEnergy = yearDim.group().reduceSum(dc.pluck('Geothermal_energy'));



    renewableEnergyChart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .legend(dc.legend().x(75).y(5).itemHeight(10).gap(10))
        .brushOn(false)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .yAxisLabel("Worldwide Renewable Energy Production (Gwh)")
        .xAxisLabel("Year")
        .dimension(yearDim)
        .group(hydropower, 'Hydropower')
        .stack(marineEnergy, 'Marine Energy')
        .stack(windEnergy, 'Wind Energy')
        .stack(solarEnergy, 'Solar Energy')
        .stack(bioEnergy, 'Bioenergy')
        .stack(geothermalEnergy, 'Geothermal Energy');
}

//renewable energy by continent chart

function buildRenewableEnergyContinentGraph(continent_ndx) {

    let continentChart = dc.compositeChart('#continent_chart');

    yearDim = continent_ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let africa = yearDim.group().reduceSum('Africa');
    let asia = yearDim.group().reduceSum('Asia');
    let centralAmerica = yearDim.group().reduceSum('Central_America_and_Carib');
    let eurasia = yearDim.group().reduceSum('Eurasia');
    let europe = yearDim.group().reduceSum('Europe');
    let middleEast = yearDim.group().reduceSum('Middle_East');
    let northAmerica = yearDim.group().reduceSum('North_America');
    let oceania = yearDim.group().reduceSum('Oceania');
    let southAmerica = yearDim.group().reduceSum('South_America');

    continentChart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .legend(dc.legend().x(650).y(50).itemHeight(10).gap(10))
        .dimension(yearDim)
        .brushOn(false)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .yAxisLabel("Renewable Energy Production (GWh)")
        .xAxisLabel("Year")
        .compose([
            dc.lineChart(continentChart)
            .colors('red')
            .group(africa, 'Africa'),
            dc.lineChart(continentChart)
            .colors('green')
            .group(asia, 'Asia'),
            dc.lineChart(continentChart)
            .colors('yellow')
            .group(centralAmerica, 'Central America & Caribbean'),
            dc.lineChart(continentChart)
            .colors('red')
            .group(eurasia, 'Eurasia'),
            dc.lineChart(continentChart)
            .colors('blue')
            .group(europe, 'Europe'),
            dc.lineChart(continentChart)
            .colors('green')
            .group(middleEast, 'Middle East'),
              dc.lineChart(continentChart)
            .colors('red')
            .group(northAmerica, 'North America'),
              dc.lineChart(continentChart)
            .colors('yellow')
            .group(oceania, 'Oceania'),
              dc.lineChart(continentChart)
            .colors('blue')
            .group(southAmerica, 'South America')
        ])
}
