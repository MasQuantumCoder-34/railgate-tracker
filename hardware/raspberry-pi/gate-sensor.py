"""
GateWatch Vaniyambadi - Raspberry Pi IoT Sensor
================================================
Connect a magnetic reed switch or IR sensor to GPIO pin 17.
When the gate opens/closes, it sends an update to the GateWatch API.

Wiring:
  - Reed switch between GPIO 17 and GND (with pull-up resistor)
  - OR: IR sensor signal wire to GPIO 17

Install:
  pip install requests RPi.GPIO
"""

import RPi.GPIO as GPIO
import requests
import time
import json

# === CONFIGURATION ===
API_URL = "http://your-render-backend-url.com/api/iot/status"
API_KEY = "gw-iot-vaniyambadi-2026"
SENSOR_PIN = 17
POLL_INTERVAL = 1  # seconds

# === SETUP ===
GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Track previous state
prev_state = GPIO.input(SENSOR_PIN)


def send_update(status: str):
    """Send gate status to the GateWatch API."""
    payload = {"status": status}
    if status == "CLOSED":
        payload["waitTime"] = 15
        payload["trainName"] = "IoT Sensor"
        payload["notes"] = "Auto-triggered by gate sensor"

    headers = {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(API_URL, json=payload, headers=headers, timeout=10)
        print(f"[{status}] API responded: {resp.status_code}")
    except Exception as e:
        print(f"[ERROR] Failed to send: {e}")


try:
    print("GateWatch IoT Sensor started. Monitoring gate...")
    while True:
        current_state = GPIO.input(SENSOR_PIN)

        if current_state != prev_state:
            if current_state == GPIO.LOW:
                print("Gate CLOSED detected")
                send_update("CLOSED")
            else:
                print("Gate OPENED detected")
                send_update("OPEN")
            prev_state = current_state

        time.sleep(POLL_INTERVAL)

except KeyboardInterrupt:
    print("Shutting down...")
finally:
    GPIO.cleanup()
