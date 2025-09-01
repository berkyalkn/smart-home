import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_get_sensors():
    # Test individual sensor endpoints (frontend now uses these)
    endpoints = [
        "/api/sensors/temperature",
        "/api/sensors/humidity",
        "/api/sensors/pressure",
        "/api/sensors/motion",
        "/api/sensors/light"
    ]

    for endpoint in endpoints:
        response = client.get(endpoint)
        # Since no hardware is connected, this should return 503 error
        assert response.status_code == 503
        assert "detail" in response.json()

def test_get_sensors_all():
    # Test the combined endpoint (deprecated - system now uses individual endpoints)
    response = client.get("/api/sensors/all")
    # Since no hardware is connected, this should return 500 error
    assert response.status_code == 500
    assert "detail" in response.json()

def test_get_lights():
    response = client.get("/api/lights/")
    assert response.status_code == 200
    data = response.json()
    assert "living_room" in data
    assert "bedroom" in data
    assert "kitchen" in data
    assert "bathroom" in data

def test_get_thermostat():
    response = client.get("/api/thermostat/")
    # Since thermostat functionality was removed, this should return 404 error
    assert response.status_code == 404

def test_control_lights():
    # Test turning on living room light
    response = client.post("/api/lights/", json={
        "room": "living_room",
        "status": True,
        "brightness": 80
    })
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["data"]["status"] == True
    assert data["data"]["brightness"] == 80

    # Test turning off living room light (should set brightness to 0)
    response = client.post("/api/lights/", json={
        "room": "living_room",
        "status": False,
        "brightness": 0  # Explicitly set brightness to 0 when turning off
    })
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["status"] == False
    assert data["data"]["brightness"] == 0

def test_get_devices():
    response = client.get("/api/devices/")
    # Since no hardware is connected, this should return 404 (route doesn't exist)
    assert response.status_code == 404