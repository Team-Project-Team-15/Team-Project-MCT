from RPi import GPIO
import paho.mqtt.client as mqtt
import json
import urllib.request
import sys
import random
import time

GPIO.setmode(GPIO.BCM)

espTopics = ['unit1/output', 'unit2/output']
espMultiplayerTopics = ['unit1/multiplayer/output', 'unit2/multiplayer/output']
messageReceived = False
start_game = False
inProgress = False

def startGame():
    global messageReceived
    global start_game
    global inProgress
    inProgress = True
    randomTopic = random.choice(espTopics)
    sendMessage(True, False, randomTopic)
    level = 0
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
            messageReceived = False
            print(f"level {level + 1} started")
            continue

        if start_game == False:
            print("level failed!")
            inProgress = False
            for topic in espTopics:
                sendMessage(False, True, topic)
            break

def sendMessage(status, game_ended, topic):
    message = {"status": status, "game_ended": game_ended}
    client.publish(topic, json.dumps(message))

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    if msg.topic == "pi/startgame":
        obj = json.loads(str(msg.payload,"UTF8"))
        global start_game
        start_game = obj['start_game']

    elif msg.topic == "pi/output":
        global messageReceived
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
    client.subscribe("pi/startgame")
    client.loop_start()

    while True:
        if start_game == True and inProgress == False:
            startGame()