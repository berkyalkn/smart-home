from fastapi import APIRouter
from api.models import OutletStatus, OutletControl
from typing import Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/outlets", tags=["outlets"])

# In-memory outlet state for demonstration purposes
# TODO: Replace with actual hardware control (GPIO pins, smart plugs, etc.)
# This provides functional outlet control for UI testing and will be replaced
# with real hardware integration later
outlet_states = {
    "main_outlet": {"on": False},
    "kitchen_outlet": {"on": True},
    "living_room_outlet": {"on": False},
    "bedroom_outlet": {"on": True}
}

@router.get("/", response_model=Dict[str, dict])
def get_outlets():
    """Get status of all outlets"""
    logger.info(f"Returning outlet states: {outlet_states}")
    return outlet_states

@router.get("/{outlet_id}", response_model=dict)
def get_outlet(outlet_id: str):
    """Get status of a specific outlet"""
    if outlet_id not in outlet_states:
        # Return default state for unknown outlets
        return {"on": False}

    logger.info(f"Returning outlet {outlet_id} state: {outlet_states[outlet_id]}")
    return outlet_states[outlet_id]

@router.post("/control")
def control_outlet(outlet_control: OutletControl):
    """Control an outlet (turn on/off)"""
    outlet_id = outlet_control.outlet_id

    if outlet_id not in outlet_states:
        outlet_states[outlet_id] = {"on": False}

    # Update the outlet state
    outlet_states[outlet_id]["on"] = outlet_control.status

    logger.info(f"Updated outlet {outlet_id}: {outlet_states[outlet_id]}")

    return {
        "message": f"Outlet {outlet_id} {'turned on' if outlet_control.status else 'turned off'}",
        "data": outlet_states[outlet_id]
    }