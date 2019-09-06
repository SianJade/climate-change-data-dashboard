queue()
    .defer(d3.csv, 'data/epa-sea-level.csv')
    .defer(d3.csv, 'data/global-temperature-rise.csv')
    .defer(d3.csv, 'data/annual-share-of-co2-emissions.csv')
    .defer(d3.csv, 'data/global-co2-concentration-ppm.csv')
    .defer(d3.csv, 'data/uk-forest-maintenance.csv')
    .defer(d3.csv, 'data/renewable-energy.csv')
    .defer(d3.csv, 'data/renewable-continents.csv')
    .defer(d3.csv, 'data/minimise-emissions.csv')
    .await(makeGraphs);


function makeGraphs(error, seaData, tempData, co2ShareData, co2AtmosphereData,
    reforestationData, renewableEnergyData, continentalRenewableEnergyData, reduceEmissionsData) {

    co2ShareData.forEach(function(d) {
        d.Global_CO2_emissions_share = parseFloat(d.Global_CO2_emissions_share);
    });

    let sea_ndx = crossfilter(seaData);
    let temp_ndx = crossfilter(tempData);
    let co2_share_ndx = crossfilter(co2ShareData);
    let atmosphere_ndx = crossfilter(co2AtmosphereData);
    let reforestation_ndx = crossfilter(reforestationData);
    let renewable_ndx = crossfilter(renewableEnergyData);
    let continent_ndx = crossfilter(continentalRenewableEnergyData);
    // let footprint_ndx = crossfilter(reduceEmissionsData);

    buildSeaGraph(sea_ndx);
    buildTempGraph(temp_ndx);
    buildCo2ShareGraph(co2_share_ndx);
    buildCo2PpmGraph(atmosphere_ndx);
    buildReforestationGraph(reforestation_ndx);
    buildRenewableEnergyTypeGraph(renewable_ndx);
    buildRenewableEnergyContinentGraph(continent_ndx);
    // buildFootprintReductionGraph(footprint_ndx);
    //showYearSelector(reforestation_ndx);

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

//see more/less button functionality

function seeMore(element) {

    let buttonClicked = event.target;
    let more = document.getElementById(element);
    if (more.style.display === "none") {
        buttonClicked.innerText = "See Less";
        more.style.display = "block";
    }
    else {
        buttonClicked.innerText = "See More";
        more.style.display = "none";
    }

}

//sea level rise line graph//

function buildSeaGraph(sea_ndx) {

    let seaLevelRiseChart = dc.compositeChart('#sea_level_rise');

    let yearDim = sea_ndx.dimension(dc.pluck('Year'));

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
        .legend(dc.legend().x(70).y(40).itemHeight(10).gap(10))
        .brushOn(false)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .xAxisLabel('Year')
        .yAxisLabel("Global Sea Level Rise (mm)")
        .compose([
            dc.lineChart(seaLevelRiseChart)
            .colors('red')
            .group(lowerErrorBound, 'Lower Error Bound'),
            dc.lineChart(seaLevelRiseChart)
            .colors('green')
            .group(averageRise, 'CSIRO Adjusted Sea Level Rise'),
            dc.lineChart(seaLevelRiseChart)
            .colors('blue')
            .group(upperErrorBound, 'Upper Error Bound')
        ]);
}




//global temperature rise chart//

function buildTempGraph(temp_ndx) {

    let tempRiseChart = dc.compositeChart('#temperature_rise');

    let yearDim = temp_ndx.dimension(dc.pluck('Year'));

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
        .legend(dc.legend().x(70).y(40).itemHeight(10).gap(10))
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
        ]);
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

    dc.bubbleChart("#co2_emissions")
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .dimension(countryDim)
        .group(totalEmissionsByCountry)
        .colors(d3.scale.category20())
        .keyAccessor(function(p) {
            return p.value.max;
        })
        .valueAccessor(function(p) {
            return p.value.min;
        })
        .radiusValueAccessor(function(p) {
            return p.value.average;
        })
        .x(d3.scale.linear().domain([0, 100]))
        .r(d3.scale.linear().domain([0, 100]))
        .maxBubbleRelativeSize(0.15)
        .minRadiusWithLabel(12)
        .elasticY(true)
        .elasticX(true)
        .xAxisPadding(10)
        .yAxisPadding(5)
        .xAxisLabel('Maximum recorded emissions')
        .yAxisLabel('Minimun recorded emissions');
}



//Atmospheric co2 concentration parts per million (ppm) chart


function buildCo2PpmGraph(atmosphere_ndx) {

    let yearDim = atmosphere_ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let co2ppm = yearDim.group().reduceSum(dc.pluck('CO2_concentration_ppm'));

    dc.barChart('#co2_ppm_chart')
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 50 })
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .y(d3.scale.linear().domain([300, 420]))
        .brushOn(false)
        .yAxisLabel("Atmospheric CO2 concentration (parts per million (ppm))")
        .xAxisLabel("Year")
        .dimension(yearDim)
        .group(co2ppm);
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

    let reforestationChart = dc.compositeChart('#reforestation_chart')

    let countryDim = reforestation_ndx.dimension(dc.pluck('Entity'));

    let newConifers = countryDim.group().reduceSum(dc.pluck('new_planting_conifers'));
    let newBroadleaves = countryDim.group().reduceSum(dc.pluck('new_planting_broadleaves'));
    let restockConifers = countryDim.group().reduceSum(dc.pluck('restocking_conifers'));
    let restockBroadleaves = countryDim.group().reduceSum(dc.pluck('restocking_broadleaves'));

    reforestationChart
        .width(1000)
        .height(500)
        .legend(dc.legend().x(90).y(5).itemHeight(10).gap(10))
        .margins({ top: 50, right: 50, bottom: 50, left: 70 })
        .x(d3.scale.ordinal().domain(['England', 'Wales', 'Scotland', 'Northern_Ireland', 'UK']))
        .xUnits(dc.units.ordinal)
        .y(d3.scale.linear().domain([0, 20]))
        .brushOn(false)
        .xAxisLabel('Country')
        .yAxisLabel('Trees planted')
        .clipPadding(10)
        .dimension(countryDim)
        .compose([
            dc.scatterPlot(reforestationChart)
            .group(newConifers, "New planting Conifers")
            .colors("blue"),
            dc.scatterPlot(reforestationChart)
            .group(newBroadleaves, "New planting Broadleaves")
            .colors("green"),
            dc.scatterPlot(reforestationChart)
            .group(restockConifers, "Restocking Conifers")
            .colors("red"),
            dc.scatterPlot(reforestationChart)
            .group(restockBroadleaves, "Restocking Broadleaves")
            .colors("yellow"),
        ]);
}

//renewable energy by type chart

function buildRenewableEnergyTypeGraph(renewable_ndx) {

    let renewableEnergyChart = dc.barChart('#renewable_chart');

    let yearDim = renewable_ndx.dimension(dc.pluck('Year'));

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
        .margins({ top: 50, right: 50, bottom: 50, left: 70 })
        .legend(dc.legend().x(90).y(10).itemHeight(10).gap(10))
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

    let continentChart = dc.lineChart('#continent_chart');

    let yearDim = continent_ndx.dimension(dc.pluck('Year'));

    let minDate = yearDim.bottom(1)[0].Year;
    let maxDate = yearDim.top(1)[0].Year;

    let africa = yearDim.group().reduceSum(dc.pluck('Africa'));
    let asia = yearDim.group().reduceSum(dc.pluck('Asia'));
    let centralAmerica = yearDim.group().reduceSum(dc.pluck('Central_America_and_Carib'));
    let eurasia = yearDim.group().reduceSum(dc.pluck('Eurasia'));
    let europe = yearDim.group().reduceSum(dc.pluck('Europe'));
    let middleEast = yearDim.group().reduceSum(dc.pluck('Middle_East'));
    let northAmerica = yearDim.group().reduceSum(dc.pluck('North_America'));
    let oceania = yearDim.group().reduceSum(dc.pluck('Oceania'));
    let southAmerica = yearDim.group().reduceSum(dc.pluck('South_America'));

    continentChart
        .width(1000)
        .height(500)
        .margins({ top: 50, right: 50, bottom: 50, left: 70 })
        .legend(dc.legend().x(90).y(5).itemHeight(10).gap(10))
        .dimension(yearDim)
        .brushOn(false)
        .transitionDuration(500)
        .renderArea(true)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .yAxisLabel("Renewable Energy Production (GWh)")
        .xAxisLabel("Year")
        .group(africa, 'Africa')
        .stack(asia, 'Asia')
        .stack(centralAmerica, 'Central America & Caribbean')
        .stack(eurasia, 'Eurasia')
        .stack(europe, 'Europe')
        .stack(middleEast, 'Middle East')
        .stack(northAmerica, 'North America')
        .stack(oceania, 'Oceania')
        .stack(southAmerica, 'South America');
}

// //minimising carbon footprint chart

// function buildFootprintReductionGraph(footprint_ndx) {

//     let footprintChart = dc.pieChart('#footprint_chart');

//     let changeDim = footprint_ndx.dimension(dc.pluck('Change'));

//     let reduction = changeDim.group().reduceSum(dc.pluck('Co2_emissions_saved_per_year'));

//     footprintChart
//     .height(1000)
//     .radius(100)
//     .transitionDuration(500)
//     .dimension(changeDim)
//     .group(reduction);

// }
