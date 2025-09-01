from fastapi import APIRouter, HTTPException
from api.models import SensorData
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/sensors", tags=["sensors"])

# Sensor configuration
BME280_I2C_ADDRESS = 0x76  # Default I2C address for BME280
BH1750_I2C_ADDRESS = 0x23  # Default I2C address for BH1750 (GY-302)
MOTION_SENSOR_PIN = 4  # GPIO pin for HC-SR501 motion sensor

# Global variables for sensor instances
bme280_sensor = None
bh1750_sensor = None
motion_sensor_initialized = False

def initialize_sensors():
    """Initialize all sensors"""
    global bme280_sensor, bh1750_sensor, motion_sensor_initialized

    try:
        # Import sensor libraries
        import board
        import busio
        import adafruit_bme280
        import adafruit_bh1750
        import RPi.GPIO as GPIO

        # Initialize I2C bus
        i2c = busio.I2C(board.SCL, board.SDA)

        # Initialize BME280 sensor
        bme280_sensor = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=BME280_I2C_ADDRESS)
        logger.info("BME280 sensor initialized successfully")

        # Initialize BH1750 light sensor
        bh1750_sensor = adafruit_bh1750.BH1750(i2c)
        logger.info("BH1750 light sensor initialized successfully")

        # Initialize motion sensor
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(MOTION_SENSOR_PIN, GPIO.IN)
        motion_sensor_initialized = True
        logger.info("HC-SR501 motion sensor initialized successfully")

    except ImportError as e:
        logger.warning(f"Sensor libraries not available: {e}")
        # Don't raise exception, just log and continue
    except Exception as e:
        logger.warning(f"Failed to initialize sensors: {e}")
        # Don't raise exception, just log and continue

def read_bme280():
    """Read temperature, humidity, and pressure from BME280"""
    if bme280_sensor is None:
        raise HTTPException(status_code=503, detail="BME280 sensor not initialized")

    try:
        temperature = bme280_sensor.temperature
        humidity = bme280_sensor.humidity
        pressure = bme280_sensor.pressure
        return {
            "temperature": round(temperature, 1),
            "humidity": int(humidity),
            "pressure": round(pressure, 2)
        }
    except Exception as e:
        logger.error(f"Failed to read BME280 sensor: {e}")
        raise HTTPException(status_code=500, detail="Failed to read BME280 sensor")

def read_motion_sensor():
    """Read motion detection from HC-SR501"""
    if not motion_sensor_initialized:
        raise HTTPException(status_code=503, detail="Motion sensor not initialized")

    try:
        import RPi.GPIO as GPIO
        motion_detected = GPIO.input(MOTION_SENSOR_PIN) == GPIO.HIGH
        return motion_detected
    except Exception as e:
        logger.error(f"Failed to read motion sensor: {e}")
        raise HTTPException(status_code=500, detail="Failed to read motion sensor")

def read_light_sensor():
    """Read light level from BH1750 (GY-302)"""
    if bh1750_sensor is None:
        raise HTTPException(status_code=503, detail="Light sensor not initialized")

    try:
        # Read lux value and convert to percentage (0-100)
        lux = bh1750_sensor.lux
        # Convert lux to percentage (assuming 0-1000 lux range maps to 0-100%)
        light_level = min(100, max(0, int((lux / 1000) * 100)))
        return light_level
    except Exception as e:
        logger.error(f"Failed to read light sensor: {e}")
        raise HTTPException(status_code=500, detail="Failed to read light sensor")




@router.get("/temperature")
def get_temperature():
    """Get temperature reading"""
    bme_data = read_bme280()
    return {"temperature": bme_data["temperature"]}

@router.get("/humidity")
def get_humidity():
    """Get humidity reading"""
    bme_data = read_bme280()
    return {"humidity": bme_data["humidity"]}

@router.get("/pressure")
def get_pressure():
    """Get pressure reading"""
    bme_data = read_bme280()
    return {"pressure": bme_data["pressure"]}

@router.get("/motion")
def get_motion():
    """Get motion detection status"""
    motion_detected = read_motion_sensor()
    return {"motion_detected": motion_detected}

@router.get("/light")
def get_light():
    """Get light level reading"""
    light_level = read_light_sensor()
    return {"light_level": light_level}