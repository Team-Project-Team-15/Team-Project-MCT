let currentminutes, currentseconds, timeStart;

// set callback handlers
const getDOMElements = function() {
  timerHtml = document.querySelector('.js-timer');
  timerText = document.querySelector('.js-timer-text');
  timerRotation = document.getElementById('timerRotation');
  levelHtml = document.querySelector('.js-level');
  params = (new URL(document.location)).searchParams;
  level = params.get('level')
}

const start = function() {
  duration = 90;
  timerHtml.addEventListener('click', function() {
    timeStart = new Date();
    localStorage.setItem("timeStart", timeStart);
    var timer = duration, minutes, seconds;
    client.publish("pi/startgame", "{\"start_game\": true}");
    timerRotation.classList.add("rotate-timer");
    var startTimer = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      timerText.textContent = minutes + ":" + seconds;
      currentminutes = minutes;
      currentseconds = seconds;
      if(--timer < 0) {
        client.publish("pi/startgame", "{\"start_game\": false}");
        timerText.textContent = "00:00";
        timerRotation.classList.remove("rotate-timer");
        clearInterval(startTimer);
      }
    }, 1000);
  })
}

const startAlreadyInProgress = function() {
  if (params.has("inProgress")) {
    timerText.textContent = "00:00";
    duration = 90;
    var timer = duration, minutes, seconds;
    timerRotation.classList.add("rotate-timer");
      var startTimer = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerText.textContent = minutes + ":" + seconds;
        currentminutes = minutes;
        currentseconds = seconds;
        if(--timer < 0) {
          client.publish("pi/startgame", "{\"start_game\": false}");
          timerText.textContent = "00:00";
          timerRotation.classList.remove("rotate-timer");
          clearInterval(startTimer);
        }
      }, 1000);
  }
}

client = new Paho.MQTT.Client("192.168.4.1", Number(9001), "clientid");

client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}

client.onMessageArrived = function (message) {
  var topic = message.destinationName;
  var payload = message.payloadString;
  console.log("Message Arrived: "+payload);

  if (topic == "webapp/output") {
    var obj = JSON.parse(String(payload));
    var level = obj.level;
    var completed = obj.completed;
    if (completed == true) {
      window.location.replace("level-completed.html?level="+level+"&minutes="+String(currentminutes)+"&seconds="+String(currentseconds));
    }
    else if (completed == false) {
      var timeEnd = new Date();
      var timeStart = new Date(localStorage.getItem("timeStart"));
      var timeDiff = Math.abs(timeEnd - timeStart) / 1000;
      var totalHours = Math.floor(timeDiff / 3600) % 24;
      var totalMinutes = Math.floor(timeDiff / 60) % 60;
      var totalSeconds = Math.floor(timeDiff % 60);
      var formattedTime = totalHours + ":" + ("0" + totalMinutes).slice(-2) + ":" + ("0" + totalSeconds).slice(-2);
      window.location.replace("result.html?level="+level+"&time="+String(formattedTime));
    }
  }
}

// Called when the connection is made
function onConnect(){
  console.log("Connected to Mosquitto Broker.");
  client.subscribe("webapp/output")
}

// Connect the client, providing an onConnect callback
client.connect({
	onSuccess: onConnect
});

document.addEventListener('DOMContentLoaded', function() {
  console.info('DOM LOADED');
  getDOMElements();
  start();
  startAlreadyInProgress();
})