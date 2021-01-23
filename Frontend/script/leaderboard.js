let jsonObject = [];

// set callback handlers
const getDOMElements = function() {
    html_leaderboard = document.querySelector('.js-table-leaderboard');
    html_search = document.querySelector('.js-input-search');
    html_dropdown = document.querySelector('.js-dropdown');
}

const showData = function(jsonObject) {
    let html_string = ``;
    let number = 1;
    for (let data of jsonObject) {
        html_string += `<tr>
        <td>${number}</td>
        <td>${data.name}</td>
        <td>Lv. ${data.score}</td>
        <td>${data.time}</td>
        </tr>`;
        number += 1;
      }
      html_leaderboard.innerHTML = html_string;
}

const showDropdownData = function(levels) {
  let html_string = `<option value="All-levels">All</option>`;
  for(let level of levels) {
    html_string += `<option value="${level}">Level ${level}</option>`
  }
  html_dropdown.innerHTML = html_string;
}

const dropdownFilter = function() {
  const selectedLevel = html_dropdown.value;
  const filteredData = jsonObject.filter(data => {
    return data.score == selectedLevel;
  });
  showData(filteredData);

  if(selectedLevel == "All-levels") {
    showData(jsonObject);
  }
}

const searchBar = function() {
  html_search.addEventListener('keyup', function(e) {
    const searchString = e.target.value.toLowerCase();
    const filteredData = jsonObject.filter(data => {
      return data.name.toLowerCase().includes(searchString);
    });
    showData(filteredData);
  })
}

const getLevels = function() {
  let levels = [];
  for(let data of jsonObject) {
    if(!levels.includes(data.score)) {
      levels.push(data.score);
    }
  }
  showDropdownData(levels);
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
    getLevels(jsonObject);
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
  searchBar();
})