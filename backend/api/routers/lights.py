# THESE Light endpoint COULD BE USED IN FUTURE FOR IMPLEMENTATION CHANGE. Now using api/sensors/lights,motion etc.
# Backend still shows the endpoint be aware.When we comment out this file backend can give errors.
from fastapi import APIRouter, HTTPException
from api.models import LightStatus, LightControl
from typing import Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/lights", tags=["lights"])

# In-memory light state for demonstration purposes
# TODO: Replace with actual hardware control (GPIO pins, smart bulbs, etc.)
# This provides functional light control for UI testing and will be replaced
# with real hardware integration later
light_states = {
    "living_room": {"on": False},
    "bedroom": {"on": False},
    "kitchen": {"on": False},
    "bathroom": {"on": False}
}

@router.get("/", response_model=Dict[str, LightStatus])
def get_lights():
    """Get status of all lights"""
    logger.info(f"Returning light states: {light_states}")
    return light_states

@router.post("/")
def control_lights(light_control: LightControl):
    """Control lights"""
    room = light_control.room

    if room not in light_states:
        raise HTTPException(status_code=404, detail=f"Room '{room}' not found")

    # Update the light state
    light_states[room]["on"] = light_control.status

    logger.info(f"Updated light {room}: {light_states[room]}")

    return {
        "message": f"Light in {room} {'turned on' if light_control.status else 'turned off'}",
        "data": light_states[room]
    }