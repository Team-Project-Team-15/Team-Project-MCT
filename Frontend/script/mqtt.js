// set callback handlers
const getDOMElements = function() {
  timerHtml = document.querySelector('.js-timer');
  timerText = document.querySelector('.js-timer-text');
  timerRotation = document.getElementById('timerRotation');
}

const start = function() {
  duration = 90;
  timerHtml.addEventListener('click', function() {
    var timer = duration, minutes, seconds;
    client.publish("pi/startgame", "{\"start_game\": true}");
    timerRotation.classList.add("rotate-timer");
    var startTimer = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      timerText.textContent = minutes + ":" + seconds;
      if(--timer < 0) {
        client.publish("pi/startgame", "{\"start_game\": false}");
        timerText.textContent = "00:00";
        timerRotation.classList.remove("rotate-timer");
        clearInterval(startTimer);
      }
    }, 1000);
  })
}

client = new Paho.MQTT.Client("192.168.4.1", Number(9001), "clientid");

client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}

client.onMessageArrived = function (message) {
  var topic = message.destinationName;
  var payload = message.payloadString;
  console.log("Message Arrived: "+payload);

  var obj = JSON.parse(String(payload));

  console.log(obj.status)
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
})