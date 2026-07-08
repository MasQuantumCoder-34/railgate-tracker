/*
  GateWatch Vaniyambadi - ESP32 IoT Sensor
  =========================================
  Uses a magnetic reed switch or IR sensor to detect gate state.
  Sends updates to the GateWatch API over WiFi.

  Wiring:
    - Reed switch: one leg to GPIO 4, other leg to GND
    - (GPIO 4 has internal pull-up enabled)

  Install:
    - ESP32 board support in Arduino IDE
    - Install ArduinoJson library
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// === CONFIGURATION ===
const char* WIFI_SSID = "YourWiFiName";
const char* WIFI_PASS = "YourWiFiPassword";
const char* API_URL = "http://your-render-backend-url.com/api/iot/status";
const char* API_KEY = "gw-iot-vaniyambadi-2026";

const int SENSOR_PIN = 4;
const int POLL_INTERVAL_MS = 500;

int prevState = HIGH;

void sendUpdate(const char* status) {
  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", API_KEY);

  StaticJsonDocument<256> doc;
  doc["status"] = status;
  if (strcmp(status, "CLOSED") == 0) {
    doc["waitTime"] = 15;
    doc["trainName"] = "ESP32 Sensor";
    doc["notes"] = "Auto-triggered by ESP32 gate sensor";
  }

  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  Serial.printf("[%s] HTTP %d\n", status, httpCode);

  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(SENSOR_PIN, INPUT_PULLUP);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. Sensor ready.");
}

void loop() {
  int currentState = digitalRead(SENSOR_PIN);

  if (currentState != prevState) {
    delay(50); // debounce
    currentState = digitalRead(SENSOR_PIN);
    if (currentState != prevState) {
      if (currentState == LOW) {
        Serial.println("Gate CLOSED");
        sendUpdate("CLOSED");
      } else {
        Serial.println("Gate OPENED");
        sendUpdate("OPEN");
      }
      prevState = currentState;
    }
  }

  delay(POLL_INTERVAL_MS);
}
