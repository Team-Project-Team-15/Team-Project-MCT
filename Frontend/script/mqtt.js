// Create a client instance: Broker, Port, Websocket Path, Client ID
client = new Paho.MQTT.Client("192.168.4.1", Number(80), "/ws", "clientId");

// set callback handlers
client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}

client.onMessageArrived = function (message) {
  console.log("Message Arrived: "+message.payloadString);
}

// Called when the connection is made
function onConnect(){
	console.log("Connected!");
}

// Connect the client, providing an onConnect callback
client.connect({
	onSuccess: onConnect
});