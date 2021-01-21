#include <analogWrite.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Bounce2.h>

// Replace the next variables with your SSID/Password combination
const char* ssid = "TheFloorIsLava";
const char* password = "TheFloorIsLava";

// Add your MQTT Broker IP address, example:
const char* mqtt_server = "192.168.4.1";

WiFiClient espClient;
PubSubClient client(espClient);

// Pins
const int ledBlauw1 = 21;
const int ledBlauw2 = 17;
const int ledBlauw3 = 16;
const int ledGroen1 = 13;
const int ledGroen2 = 12;
const int ledGroen3 = 27;
const int ledRood = 32;
const int knop = 33;

Button button = Button();

bool status = false;
bool multiplayerStatus = false;
bool game_ended = false;

int brightness = 0;
int brightness1 = 126;
int brightness2 = 252;
int fadeamount = 3;
int fadeamount1 = 3;
int fadeamount2 = 3;

int fadeamount_end = 10;
int brightness_end = 0;

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  button.attach(knop, INPUT);
  button.interval(25);
  button.setPressedState(LOW);

  pinMode(ledBlauw1, OUTPUT);
  pinMode(ledBlauw2, OUTPUT);
  pinMode(ledBlauw3, OUTPUT);
  pinMode(ledGroen1, OUTPUT);
  pinMode(ledGroen2, OUTPUT);
  pinMode(ledGroen3, OUTPUT);
  pinMode(ledRood, OUTPUT);
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

  String topicStr = topic;

  if (topicStr.equals("unit1/output")) {
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);

    status = doc["status"];
    game_ended = doc["game_ended"];
    Serial.print("status: ");
    Serial.print(status);
    Serial.println();
    Serial.print("game_ended: ");
    Serial.print(game_ended);
    Serial.println();
  } else if (topicStr.equals("unit1/multiplayer/output")) {
      StaticJsonDocument<256> doc;
      deserializeJson(doc, payload, length);
  
      multiplayerStatus = doc["status"];
      game_ended = doc["game_ended"];
      Serial.print("multiplayerStatus: ");
      Serial.print(multiplayerStatus);
      Serial.println();
      Serial.print("game_ended: ");
      Serial.print(game_ended);
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
      client.subscribe("unit1/multiplayer/output");
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
  button.update();
  
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if(status == true && multiplayerStatus == false) {
    analogWrite(ledBlauw1, brightness);
    analogWrite(ledBlauw2, brightness1);
    analogWrite(ledBlauw3, brightness2);
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
    analogWrite(ledBlauw1, 0);
    analogWrite(ledBlauw2, 0);
    analogWrite(ledBlauw3, 0);
  }

  if(multiplayerStatus == true && status == false) {
    analogWrite(ledGroen1, brightness);
    analogWrite(ledGroen2, brightness1);
    analogWrite(ledGroen3, brightness2);
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
  } else if(multiplayerStatus == false) {
    analogWrite(ledGroen1, 0);
    analogWrite(ledGroen2, 0);
    analogWrite(ledGroen3, 0);
  }

  if(game_ended == true) {
    int repeat = 0;
    status = false;
    multiplayerStatus = false;
    while(repeat <= 500) {
      analogWrite(ledBlauw1, 0);
      analogWrite(ledBlauw2, 0);
      analogWrite(ledBlauw3, 0);
      analogWrite(ledGroen1, 0);
      analogWrite(ledGroen2, 0);
      analogWrite(ledGroen3, 0);
      analogWrite(ledRood, brightness_end);
      brightness_end = brightness_end + fadeamount_end;
      if (brightness_end <= 0 || brightness_end >= 255) {
        fadeamount_end = -fadeamount_end;
      }
      repeat += 1;
      delay(5);
    }
    game_ended = false;
    analogWrite(ledBlauw1, 0);
    analogWrite(ledBlauw2, 0);
    analogWrite(ledBlauw3, 0);
    analogWrite(ledGroen1, 0);
    analogWrite(ledGroen2, 0);
    analogWrite(ledGroen3, 0);
    analogWrite(ledRood, 0);
  }

  if(button.pressed() && status == true) {
    status = false;
    client.publish("pi/output", "{\"id\": unit1, \"button_pressed\": true}");
  }

  if(button.pressed() && multiplayerStatus == true) {
    multiplayerStatus = false;
    client.publish("pi/output", "{\"id\": unit1, \"button_pressed\": true}");
  }
}
