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

    /////////// pseudo code
    // if (role.indexOf("/") > -1) {
    // convert to moment.js and return
    //}
    /////////// pseudo code

    console.log(`name: ${name}`);
    console.log(`destination: ${destination}`);
    console.log(`firstTrainTimeRaw: ${firstTrainTimeRaw}`);
    console.log(`frequency: ${frequency}`);

    var firstTrainTime = moment.unix(firstTrainTimeRaw).format("HH:mm");

    console.log(`firstTrainTime: ${firstTrainTime}`);

    var minDifference = moment().diff(
        moment(firstTrainTimeRaw, "X"),
        "minutes"
    );

    var now = moment();
    console.log(`now: ${now}`);

    var now2 = moment(now).format("X");
    console.log(now2);

    var minToNext = frequency - (minDifference % frequency);

    console.log(`minToNext: ${minToNext}`);

    console.log(moment().format("HH:mm"));

    var nextTimeRaw = moment().add(minToNext, "minutes");
    var nextTime = nextTimeRaw.format("HH:mm");

    console.log(`next time: ${nextTime}`);

    var newTrain = $("<tr>");
    newTrain.append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTime),
        $("<td>").text(minToNext)
    );

    $("#train-table > tbody").append(newTrain);
});
