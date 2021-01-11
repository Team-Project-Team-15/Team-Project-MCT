#include <analogWrite.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Replace the next variables with your SSID/Password combination
const char* ssid = "TheFloorIsLava";
const char* password = "TheFloorIsLava";

// Add your MQTT Broker IP address, example:
const char* mqtt_server = "192.168.4.1";

WiFiClient espClient;
PubSubClient client(espClient);

// LED Pin
const int ledPin = 13;
const int ledPin1 = 12;
const int ledPin2 = 27;
const int buzzer = A3;

bool status = false;

int brightness = 0;
int brightness1 = 126;
int brightness2 = 252;
int fadeamount = 3;
int fadeamount1 = 3;
int fadeamount2 = 3;

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pinMode(ledPin, OUTPUT);
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(buzzer, OUTPUT);
}

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if (topic = "unit1/output") {
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);

    status = doc["status"];
    Serial.print("status: ");
    Serial.print(status);
    Serial.println();
  }
  else {
    Serial.print("Message was not targetted to this unit.");   
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("Unit1")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("unit1/output");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if(status == true) {
    analogWrite(ledPin, brightness);
    analogWrite(ledPin1, brightness1);
    analogWrite(ledPin2, brightness2);
    brightness = brightness + fadeamount;
    brightness1 = brightness1 + fadeamount1;
    brightness2 = brightness2 + fadeamount2;
  
    if (brightness <= 0 || brightness >= 255) {
      fadeamount = -fadeamount;
    }
    if (brightness1 <= 0 || brightness1 >= 255) {
      fadeamount1 = -fadeamount1;
    }
    if (brightness2 <= 0 || brightness2 >= 255) {
      fadeamount2 = -fadeamount2;
    }
    delay(5);
  } else if(status == false) {
    analogWrite(ledPin, 0);
    analogWrite(ledPin1, 0);
    analogWrite(ledPin2, 0);
  }
}
