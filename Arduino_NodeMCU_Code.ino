#include <SoftwareSerial.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <Arduino.h>

ESP8266WiFiMulti WiFiMulti;

#define rxPin 13
#define txPin 15
uint8_t on;

SoftwareSerial sSerial(rxPin, txPin);
uint8_t serialBuffer;
String receivedstr;

void setup() {
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);
  Serial.begin(115200);
  sSerial.begin(115200);
  
   Serial.println();
   Serial.println();
   Serial.println();

   for(uint8_t t = 4; t > 0; t--) {
       Serial.printf("[SETUP] WAIT %d...\n", t);
       Serial.flush();
       delay(1000);
   }

    WiFiMulti.addAP("COMP", "tvts2679");
}

void loop() {
  Serial.println("Not In Looped");
  while(sSerial.available() > 0) {
    //serialBuffer = sSerial.read();
    receivedstr = sSerial.readStringUntil('n');
    sSerial.readStringUntil('n');
    Serial.println();
    Serial.println();
    Serial.println();
    Serial.println("-----------------New---------------\n");
    Serial.println();
    Serial.println("Sensor Value : " + receivedstr);
    Serial.println("Completed\n");
    if((WiFiMulti.run() == WL_CONNECTED)) {

        HTTPClient http;

        Serial.print("[HTTP] begin...\n");
        // configure traged server and url
        //http.begin("https://192.168.1.12/test.html", "7a 9c f4 db 40 d3 62 5a 6e 21 bc 5c cc 66 c8 3e a1 45 59 38"); //HTTPS
        http.begin("http://api.thingspeak.com/update?api_key=I4FUQAC7QSAXN7UR&field1="+receivedstr); //HTTP
        

        Serial.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode = http.GET();
        Serial.println(httpCode);
        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            Serial.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
//                Serial.println(payload);
                if(payload == "0"){
                  Serial.println("Data haven't send\n");
                }else{
                  Serial.println("Data have send as " + payload + "th.\n");
                }
            }
        } else {
            Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }
        delay(2000);
        HTTPClient http1;
        Serial.print("[HTTP] begin...\n");
        // configure traged server and url
        //http.begin("https://192.168.1.12/test.html", "7a 9c f4 db 40 d3 62 5a 6e 21 bc 5c cc 66 c8 3e a1 45 59 38"); //HTTPS
        http1.begin("http://api.thingspeak.com/channels/388619/feeds.json?api_key=AZ8IUV4UVG6RVTI8&results=1"); //HTTP
        

        Serial.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode1 = http1.GET();
        Serial.println(httpCode1);

        // httpCode will be negative on error
        if(httpCode1 > 0) {
            // HTTP header has been send and Server response header has been handled
            Serial.printf("[HTTP] GET... code: %d\n", httpCode1);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                StaticJsonBuffer<1000> jsonBuffer;
                String payload = http1.getString();
                Serial.println("Payload : " + payload);
                JsonObject& root = jsonBuffer.parseObject(payload);
                String n = root["feeds"][0]["field1"];
                Serial.println("root.success() : "+String(root.success()));
                Serial.println(n);
                if(n == "0"){
                  on = 0;
                }else{
                  on = 1;
                }
                sSerial.println(on);
                Serial.println(n);
                Serial.println("Sent\n");
                http1.end();
            }
        } else {
            Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }
    }

    delay(5000);
  }
}
