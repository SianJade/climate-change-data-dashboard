function countdown() {
    var startDate = new Date();
    var endDate = new Date('March 28, 2030 00:00:00'); //UN report publication date

    var startTime = startDate.getTime();
    var endTime = endDate.getTime();

    var timeRemaining = endTime - startTime;

    var seconds = Math.floor(timeRemaining / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours = hours % 24;
    minutes %= 60;
    seconds %= 60;

    days = (days < 10) ? '0' + days : days;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    document.getElementById('days').innerHTML = days;
    document.getElementById('hours').innerHTML = hours;
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;

    setTimeout(countdown,1000);

}

countdown();
