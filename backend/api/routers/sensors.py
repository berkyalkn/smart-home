from fastapi import APIRouter, HTTPException
import logging
import random 

# --- Sensor Libraries ---
try:
    import lgpio
    import board
    import busio
    from adafruit_bme280 import basic as adafruit_bme280
    import adafruit_bh1750
    IS_HARDWARE_AVAILABLE = True
except ImportError:
    IS_HARDWARE_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/sensors",
    tags=["Sensors"],
)

bme280_sensor = None
bh1750_sensor = None
gpio_handle = None
PIR_PIN = 4

def initialize_sensors():
    global bme280_sensor, bh1750_sensor, gpio_handle

    if not IS_HARDWARE_AVAILABLE:
        logger.warning("Hardware libraries not found. Running in mock data mode.")
        return

    try:
        i2c = busio.I2C(board.SCL, board.SDA)
        bme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=0x77)
        bh1750_sensor = adafruit_bh1750.BH1750(i2c, address=0x23)
        gpio_handle = lgpio.gpiochip_open(0)
        lgpio.gpio_claim_input(gpio_handle, PIR_PIN)
        logger.info("✅ All sensors initialized successfully.")
    except Exception as e:
        logger.error(f"WARNING: Could not initialize hardware sensors: {e}. Running in mock data mode.")
        bme280_sensor, bh1750_sensor, gpio_handle = None, None, None

initialize_sensors()

def get_mock_sensor_data():
    """Generates realistic-looking fake sensor data."""
    return {
        "temperature": round(random.uniform(22.0, 26.0), 2),
        "humidity": round(random.uniform(40.0, 60.0), 2),
        "pressure": round(random.uniform(1010.0, 1015.0), 2),
        "light": round(random.uniform(100.0, 800.0), 2),
        "motion_detected": random.choice([True, False])
    }

@router.get("/all")
async def get_all_sensors():
    if not all([bme280_sensor, bh1750_sensor, gpio_handle]):
        return get_mock_sensor_data()

    try:
        return {
            "temperature": round(bme280_sensor.temperature, 2),
            "humidity": round(bme280_sensor.humidity, 2),
            "pressure": round(bme280_sensor.pressure, 2),
            "light": round(bh1750_sensor.lux, 2),
            "motion_detected": bool(lgpio.gpio_read(gpio_handle, PIR_PIN))
        }
    except Exception as e:
        logger.error(f"Error reading real sensors: {e}. Falling back to mock data.")
        return get_mock_sensor_data()

@router.get("/{sensor_name}")
async def get_single_sensor(sensor_name: str):
    all_data = await get_all_sensors()
    
    key_map = {
        "temperature": "temperature",
        "humidity": "humidity",
        "pressure": "pressure",
        "light": "light",
        "motion": "motion_detected"
    }
    
    if sensor_name not in key_map:
        raise HTTPException(status_code=404, detail="Sensor not found")
        
    data_key = key_map[sensor_name]
    
    if sensor_name == "light":
        return {"light_level": all_data[data_key]}
    elif sensor_name == "motion":
        return {"motion_detected": all_data[data_key]}
    else:
        return {sensor_name: all_data[data_key]}