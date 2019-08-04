queue()
    .defer(d3.json, 'data/epa-sea-level.csv')
    .await(countdown);
    
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
