from RPi import GPIO

GPIO.setmode(GPIO.BCM)

try:
    while True:
        print("Script started")

except KeyboardInterrupt as e:
    print(e)

finally:
    GPIO.cleanup()
    print("Script has stopped!!!")