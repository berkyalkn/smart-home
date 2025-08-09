import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

led_pin = 27
button_pin = 17

GPIO.setup(led_pin, GPIO.OUT)
GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

print("Starting button-to-LED reflex test...")
print("Press and hold the button to light up the LED. Press CTRL+C to exit.")

GPIO.output(led_pin, GPIO.LOW)

try:
    while True:
        if GPIO.input(button_pin) == GPIO.HIGH:
            GPIO.output(led_pin, GPIO.HIGH) 
        else:
            GPIO.output(led_pin, GPIO.LOW) 

        time.sleep(0.02) 

except KeyboardInterrupt:
    print("\nTest stopped by user.")

finally:
    GPIO.cleanup()
    print("GPIO cleanup complete. Exiting.")