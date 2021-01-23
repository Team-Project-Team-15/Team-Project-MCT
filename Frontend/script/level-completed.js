client = new Paho.MQTT.Client("192.168.4.1", Number(9001), "clientid");

const getDOMElements = function() {
    cooldownTimerHtml = document.querySelector('.js-cooldown-timer');
    levelHtml = document.querySelector('.js-level');
    levelRemainingHtml = document.querySelector('.js-level-remaining');
    stopBtnHtml = document.querySelector('.js-stop');
    params = (new URL(document.location)).searchParams;
    level = parseInt(params.get('level'));
    minutes = params.get('minutes');
    seconds = params.get('seconds');
}

const drawItems = function() {
    levelHtml.textContent = "LEVEL " + String(level);
    levelRemainingHtml.textContent = String(minutes) + ":" + String(seconds);
}

const cooldown = function() {
    duration = 5;
    var cooldown = duration, minutes, seconds;
    var startCooldown = setInterval(() => {
        minutes = parseInt(cooldown / 60, 10);
        seconds = parseInt(cooldown % 60, 10);
  
        minutes = minutes < 10 ? minutes : minutes;
        seconds = seconds < 10 ? seconds : seconds;
  
        cooldownTimerHtml.textContent = seconds + "...";
        if(--cooldown < 0) {
          cooldownTimerHtml.textContent = "0";
          window.location.replace("start.html?inProgress&level="+ (level + 1));
          clearInterval(startCooldown);
        }
    }, 1000);
}

const stopBtn = function() {
    stopBtnHtml.addEventListener('click', function() {
        client.publish("pi/startgame", "{\"start_game\": false}");
        window.location.replace("index.html");
    })
}

client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}

client.onMessageArrived = function (message) {
  var topic = message.destinationName;
  var payload = message.payloadString;
  console.log("Message Arrived: "+payload);
}

// Called when the connection is made
function onConnect(){
  console.log("Connected to Mosquitto Broker.");
}

// Connect the client, providing an onConnect callback
client.connect({
	onSuccess: onConnect
});

document.addEventListener('DOMContentLoaded', function() {
    console.info('DOM LOADED');
    getDOMElements();
    cooldown();
    drawItems();
    stopBtn();
  })