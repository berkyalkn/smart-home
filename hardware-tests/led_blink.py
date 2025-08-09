import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)


led_pin = 27

GPIO.setup(led_pin, GPIO.OUT)

print("Starting LED blink test...")
print("Press CTRL+C to exit.")

try:
    while True:
        GPIO.output(led_pin, GPIO.HIGH)
        time.sleep(0.5) 

        GPIO.output(led_pin, GPIO.LOW)
        time.sleep(0.5) 

except KeyboardInterrupt:
    print("Test stopped by user.")

finally:
    GPIO.cleanup()
    print("GPIO cleanup complete. Exiting.")