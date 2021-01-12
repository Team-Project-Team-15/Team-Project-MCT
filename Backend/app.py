from RPi import GPIO
import paho.mqtt.client as mqtt
import json
import urllib.request
import sys
import random
import time

GPIO.setmode(GPIO.BCM)

def sendMessage():
    message = {"status": True, "game_ended": False}
    client.publish('unit1/output', json.dumps(message))

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
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
    sendMessage()

try:
    while True:
        print("Script started")
        time.sleep(5)

except KeyboardInterrupt as e:
    print(e)

finally:
    GPIO.cleanup()
    print("Script has stopped!!!")