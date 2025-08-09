import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

button_pin = 17

GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

print("Starting button read test...")
print("Press the button to see a message. Press CTRL+C to exit.")

try:
    while True:
        if GPIO.input(button_pin) == GPIO.HIGH:
            print("Button Pressed!")
            time.sleep(0.5)
        time.sleep(0.01) 

except KeyboardInterrupt:
    print("Test stopped by user.")

finally:
    GPIO.cleanup()
    print("GPIO cleanup complete. Exiting.")