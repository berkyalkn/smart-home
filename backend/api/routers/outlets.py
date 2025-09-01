from fastapi import APIRouter, HTTPException
from api.models import OutletControl
from typing import Dict
import logging
import os
from dotenv import load_dotenv
from tapo import ApiClient


load_dotenv()
TAPO_USERNAME = os.getenv("TAPO_USERNAME")
TAPO_PASSWORD = os.getenv("TAPO_PASSWORD")


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/outlets", tags=["outlets"])

TAPO_DEVICES = {
    "main_outlet": os.getenv("TAPO_IP"),
}

tapo_device_objects: Dict[str, ApiClient] = {}


async def initialize_tapo_devices():
    logger.info("Initializing Tapo outlet connections...")
    if not all([TAPO_USERNAME, TAPO_PASSWORD]):
        logger.error("Tapo username or password not set in .env file.")
        return
    
    client = ApiClient(TAPO_USERNAME, TAPO_PASSWORD)
    for outlet_id, ip_address in TAPO_DEVICES.items():
        if ip_address:
            try:
                device = await client.p110(ip_address)
                tapo_device_objects[outlet_id] = device
                logger.info(f"✅ Successfully connected to outlet '{outlet_id}' at {ip_address}")
            except Exception as e:
                logger.error(f"❌ FAILED to connect to outlet '{outlet_id}' at {ip_address}: {e}")



@router.get("/{outlet_id}")
async def get_outlet(outlet_id: str):
    """Get the current status (on/off) of a specific outlet."""
    if outlet_id not in tapo_device_objects:
        raise HTTPException(status_code=404, detail=f"Outlet '{outlet_id}' not configured or connection failed.")
    
    try:
        device_info = await tapo_device_objects[outlet_id].get_device_info()
        is_on = device_info.to_dict().get("device_on", False)
        return {"on": is_on}
    except Exception as e:
        logger.error(f"Failed to get status for {outlet_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to communicate with the plug.")


@router.post("/control")
async def control_outlet(outlet_control: OutletControl):
    """Control an outlet (turn it on or off)."""
    outlet_id = outlet_control.outlet_id
    status_to_set = outlet_control.status

    if outlet_id not in tapo_device_objects:
        raise HTTPException(status_code=404, detail=f"Outlet '{outlet_id}' not configured or connection failed.")
    
    try:
        device = tapo_device_objects[outlet_id]
        if status_to_set:
            await device.on()
        else:
            await device.off()
        
        logger.info(f"Outlet '{outlet_id}' turned {'ON' if status_to_set else 'OFF'}")
        
        return {
            "message": f"Outlet {outlet_id} turned {'on' if status_to_set else 'off'}",
            "data": {"on": status_to_set}
        }
    except Exception as e:
        logger.error(f"Failed to control {outlet_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to send command to the plug.")