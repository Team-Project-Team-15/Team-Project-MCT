from RPi import GPIO
from flask import Flask
import paho.mqtt.client as mqtt
import json
import urllib.request
import sys
import random
import time

GPIO.setmode(GPIO.BCM)

app = Flask(__name__)

espTopics = ['unit1/output', 'unit2/output']
espMultiplayerTopics = ['unit1/multiplayer/output', 'unit2/multiplayer/output']
messageReceived = False

@app.route("/")
def index():
    return "Hello"

@app.route("/start")
def start():
    startGame()
    return "Game ended"

def startGame():
    global messageReceived
    randomTopic = random.choice(espTopics)
    sendMessage(True, False, randomTopic)
    level = 0
    levelTime = 90
    print("Game started")
    while True:
        if messageReceived == True:
            sendMessage(False, False, randomTopic)
            level += 1
            print(f"level {level} completed")
            print("Waiting for next level to start..")
            time.sleep(5)
            randomTopic = random.choice(espTopics)
            sendMessage(True, False, randomTopic)
            levelTime = 90
            messageReceived = False
            print(f"level {level + 1} started")
            continue

        if levelTime == 0:
            print("level failed!")
            for topic in espTopics:
                sendMessage(False, True, topic)
            break

        print(levelTime)
        levelTime -= 1
        time.sleep(1)

def sendMessage(status, game_ended, topic):
    message = {"status": status, "game_ended": game_ended}
    client.publish(topic, json.dumps(message))

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

def on_message(client, userdata, msg):
    global messageReceived
    print(msg.topic+" "+str(msg.payload))
    messageReceived = True
    #obj = json.loads(str(msg.payload,"UTF8"))
    #global isFreeParkingEnabled
    #isFreeParkingEnabled = obj['isFreeParkingEnabled']
    #print(isFreeParkingEnabled)
    
if __name__ == '__main__':
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("192.168.4.1", 1883, 60)
    client.subscribe("pi/output")
    client.loop_start()
    app.run(host='192.168.4.1', port=5000)