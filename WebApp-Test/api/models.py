from pydantic import BaseModel
from typing import Optional

class SensorData(BaseModel):
    temperature: float
    humidity: int
    pressure: float
    motion_detected: bool
    light_level: int

class LightStatus(BaseModel):
    on: bool

class ThermostatStatus(BaseModel):
    temperature: float
    target_temperature: float
    mode: str
    status: str

class LightControl(BaseModel):
    room: str
    status: bool

class ThermostatControl(BaseModel):
    temperature: float
    mode: str


class OutletStatus(BaseModel):
    on: bool

class OutletControl(BaseModel):
    outlet_id: str
    status: bool