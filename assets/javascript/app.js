// Initialize Firebase
var config = {
    apiKey: "AIzaSyADSjuzOtZEUMqc1ebydBlW1PG9uCOrHac",
    authDomain: "rps-multiplayer-2d2c1.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-2d2c1.firebaseio.com",
    projectId: "rps-multiplayer-2d2c1",
    storageBucket: "rps-multiplayer-2d2c1.appspot.com",
    messagingSenderId: "983090244555"
};
firebase.initializeApp(config);

database = firebase.database();

var trains = database.ref("/trains");

$("#add-train").on("click", function(event) {
    event.preventDefault();

    var tname = $("#train-name")
        .val()
        .trim();
    var tdestination = $("#destination")
        .val()
        .trim();
    var tfirstTrainTime = moment(
        $("#first-train-time")
            .val()
            .trim(),
        "HH:mm"
    ).format("X");
    var tfrequency = $("#frequency")
        .val()
        .trim();

    console.log(tname);
    console.log(tdestination);
    console.log(tfirstTrainTime);
    console.log(tfrequency);

    var newTrain = {
        name: tname,
        destination: tdestination,
        firstTrainTime: tfirstTrainTime,
        frequency: tfrequency
    };

    trains.push(newTrain);
});

// first - console log data
database.ref("/trains").on("child_added", function(snap) {
    var name = snap.val().name;
    var destination = snap.val().destination;
    var firstTrainTimeRaw = snap.val().firstTrainTime;
    var frequency = snap.val().frequency;

    console.log(`name: ${name}`);
    console.log(`destination: ${destination}`);
    console.log(`firstTrainTimeRaw: ${firstTrainTimeRaw}`);
    console.log(`frequency: ${frequency}`);

    var firstTrainTime = moment.unix(firstTrainTimeRaw).format("HH:mm");

    console.log(`firstTrainTime: ${firstTrainTime}`);

    // two scenarios: first, that it is PAST the start time of the train

    if (moment().format("HH:mm") > firstTrainTime) {
        var minDifference = moment().diff(
            moment(firstTrainTimeRaw, "X"),
            "minutes"
        );

        var now = moment();
        console.log(`now: ${now}`);

        var now2 = moment(now).format("X");
        console.log(now2);

        console.log(moment().format("X"));

        var minToNext = frequency - (minDifference % frequency);

        console.log(`minToNext: ${minToNext}`);

        console.log(moment().format("HH:mm"));

        var nextTimeRaw = moment().add(minToNext, "minutes");
        var nextTime = nextTimeRaw.format("HH:mm");

        console.log(`next time: ${nextTime}`);
    }
    // second: the train hasn't started yet!
    else {
        nextTime = firstTrainTime;
        // minutes to next: first train time - current time
        var now2 = moment().format("X");
        var now = moment().format("HH:mm");

        var minToNext = moment(firstTrainTime, "HH:mm").diff(
            moment(now, "HH:mm"),
            "minutes"
        );
    }

    var newTrain = $("<tr>");
    newTrain.append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(firstTrainTime),
        $("<td>").text(frequency),
        $("<td>").text(nextTime),
        $("<td>").text(minToNext)
    );

    $("#train-table > tbody").append(newTrain);
});
