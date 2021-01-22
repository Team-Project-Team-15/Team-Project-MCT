let jsonObject;

// set callback handlers
const getDOMElements = function() {
    html_leaderboard = document.querySelector('.js-table-leaderboard');
}

const showData = function(jsonObject) {
    let html_string = ``;
    let number = 1;
    for (let data of jsonObject) {
        html_string += `<tr>
        <td>${number}</td>
        <td>${data.name}</td>
        <td>LEVEL ${data.score}</td>
        <td>${data.time}</td>
        </tr>`;
        number += 1;
      }
      html_leaderboard.innerHTML = html_string;
}

client = new Paho.MQTT.Client("192.168.4.1", Number(9001), "clientid");

client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}

client.onMessageArrived = function (message) {
  var topic = message.destinationName;
  var payload = message.payloadString;
  console.log("Message Arrived: "+payload);

  if (topic == "webapp/output/database") {
    jsonObject = JSON.parse(String(payload));
    console.log(jsonObject)
    showData(jsonObject);
    }
}

// Called when the connection is made
function onConnect(){
  console.log("Connected to Mosquitto Broker.");
  client.subscribe("webapp/output/database");
  client.publish("database/get", "Get data");
}

// Connect the client, providing an onConnect callback
client.connect({
	onSuccess: onConnect
});

document.addEventListener('DOMContentLoaded', function() {
  console.info('DOM LOADED');
  getDOMElements();
})