# SmartNodeFarming

Smart Node Farming is a little device created to help manage farming. It reads soil humidity then send the collected data to the web to store data, show data, and warn users to water their plants.

## Sensors Used
Grove - Moisture Sensor: a sensor that can be used to detect the humidity in soil.

## Tools Used
1. STM32 Board
2. Arduino Board
3. ThingSpeak API
4. Grove Moisture Sensor

## How Smart Node Farming Device Works
1. STM32 board receives soil humidity value from the sensor
2. STM32 passes all data to Arduino.
3. Arduino sends data to ThingSpeak server
4. Web page receives and processes data from ThingSpeak server

## Application of Smart Node Farming
1. Detect soil humidity.
2. Send data collected from sensors to the server and show the data, along with temperature and air humidity in a web page.
3. Users can monitor soil humidity, temperature, and air humidity and set preferred humidity/temperature level using the provided web page.
