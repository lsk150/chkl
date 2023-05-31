int ena = 5;
int in1 = 7;
int in2 = 6;
int stopSwitchPin = 9;
int stopSwitchPin1 = 8;
int rotDirection = 0;
int led = 2;
#include <OneWire.h>
#include <DallasTemperature.h>
float temp = 0.0;
int oneWireBus = 10;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);
int fan = 12;
bool messagePrinted = false;
bool valuePrinted = false;

void setup() {
  Serial.begin(9600);//enable serial monitor
  pinMode(ena, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(led, OUTPUT);
  pinMode(fan, OUTPUT);
  pinMode(stopSwitchPin, INPUT_PULLUP);
  pinMode(stopSwitchPin1, INPUT_PULLUP);
  sensors.begin();
}

void loop() {
  int value = analogRead(A0);//read value
  int stopSwitchPinState = digitalRead(stopSwitchPin);
  int stopSwitchPinState1 = digitalRead(stopSwitchPin1);

//    ----------------- MOTOR -----------------
  // check condition
  if (value < 900) {
  
    digitalWrite(in1,HIGH);
    digitalWrite(in2,LOW);
    analogWrite(ena, 255);   //run motor full speed
    
    // if switch is closed (activated)
    if (stopSwitchPinState == LOW) {
      digitalWrite(in1,LOW);
      digitalWrite(in2,LOW);
      stopSwitchPinState == HIGH;
    }
    
    if (!valuePrinted) {
      Serial.print("Value : ");
      Serial.println(value);
      valuePrinted = true;
    }
  } else {
    valuePrinted = false;
  }

    if (value > 900) {
  if (stopSwitchPinState1 == HIGH) {
    digitalWrite(in1,LOW);
    digitalWrite(in2,HIGH);
    analogWrite(ena, 255);   //run motor full speed
  }
    
    // if switch is closed (activated)
    if (stopSwitchPinState1 == LOW) {
      digitalWrite(in1,LOW);
      digitalWrite(in2,LOW);
      stopSwitchPinState == HIGH;
    }
  } 


//    ----------------- FAN -----------------

     sensors.requestTemperatures();
     temp = sensors.getTempCByIndex(0);
     if(temp > 0) {
       digitalWrite(fan, HIGH);
     }
 
//     Serial.print("Temperature is: ");
//     Serial.println(temp);


//    ----------------- CONTROL -----------------
  if (Serial.available() > 0) {
      String incoming = Serial.readString();
      if (incoming == "hello world") {
        digitalWrite(fan, HIGH);
      }
  }
//    -------------------------------------------
}



//     //mobile control
//     if (Serial.available() > 0) {
//    // Create a new string variable to receive Serial data
//    String receivedString = "";
//    
//    // Loop through received data and append to the receivedString variable
//    while (Serial.available() > 0) {
//      receivedString += char(Serial.read ());
//    }
//    
//    // Print received Serial data
//    Serial.println(receivedString);
//    
//    // Change LED status based on received data
//    if(receivedString == "1") {
//      Serial.println("Opened Fan"); 
//      digitalWrite(fan, HIGH);
//      analogWrite(fan, 255);
//    } else if(receivedString == "0") {
//      Serial.println("Closed Fan");   
//      digitalWrite(fan, LOW); 
//    }
//
//     if(receivedString == "01") {
//      Serial.println("Opened Canopy"); 
//      digitalWrite(in1,HIGH);
//      digitalWrite(in2,LOW);
//      analogWrite(ena, 255);   //run motor full speed
//
//    if (stopSwitchPinState == LOW) {  //if switch is closed (activated)
//        digitalWrite(in1,LOW);
//        digitalWrite(in2,LOW);
//      stopSwitchPinState == HIGH;
//    }
//    }
//    if(receivedString == "00") {
//      Serial.println("Closed Canopy");    
//if(stopSwitchPinState1 == HIGH) {
//      // change direction
//      digitalWrite(in1,LOW);
//      digitalWrite(in2,HIGH);
//      analogWrite(ena, 255);   //run motor full speed
//      rotDirection = 0;
//    }
//
//    // if activated 
//     if(stopSwitchPinState1 == LOW) {
//      digitalWrite(in1,LOW);
//      digitalWrite(in2,LOW);
//    }
//    }
//  }


  