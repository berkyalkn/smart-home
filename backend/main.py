from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import sensors, lights, outlets, thermostat

app = FastAPI(title="Smart Home AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://raspberrypi.local:3000", "http://192.168.0.31:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(sensors.router)
app.include_router(lights.router)
app.include_router(outlets.router)
app.include_router(thermostat.router)

@app.get("/")
def read_root():
    return {"message": "Smart Home AI API is running"}