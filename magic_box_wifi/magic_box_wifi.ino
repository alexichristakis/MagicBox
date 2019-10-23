#include <WiFi.h>
#include <WebServer.h>
#include <WiFiUdp.h>

/* Put your SSID & Password */
const char* ssid = "Magic Box";
const char* password = "hellothisismyesp";

float pin1Value = 0;
float pin2Value = 0;
float pin3Value = 0;

/* Put IP Address details */
IPAddress local_ip(192,168,1,1);
IPAddress gateway(192,168,1,1);
IPAddress subnet(255,255,255,0);

WebServer server(80);

WiFiUDP udp;

void setup() {
//  Serial.begin(115200);

  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  
  server.begin();
}

void loop() {
    pin1Value = analogRead(34);
    pin2Value = analogRead(33);
    pin3Value = analogRead(32);

    udp.beginPacket("192.168.1.2", 57455);
    udp.print(String(pin1Value) + "," + String(pin2Value) + "," + String(pin3Value));
    udp.endPacket();
    
    //Wait for 0.1 seconds
    delay(100);
}
