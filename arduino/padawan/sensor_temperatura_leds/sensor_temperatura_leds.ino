// Desenvolver uma barra de progressão usando a barra de LEDs, ultilizar o sensor LDR.
const int interval = 500;
const int seletor = A3;

//4 LEDs
const int bar_g = 8;
const int bar_y1 = 7;
const int bar_y2 = A5;
const int bar_r = A4;

const int pinLdr = A0;
int temperature = 0;

void setup() {
  // Serial.begin(9600);
  digitalWrite(seletor, HIGH);
  
  pinMode(bar_g, OUTPUT);
  pinMode(bar_y1, OUTPUT);
  pinMode(bar_y2, OUTPUT);
  pinMode(bar_r, OUTPUT);
  pinMode(seletor, OUTPUT);
}

void loop() {
  resetLeds();
  temperature = toCelsius(analogRead(pinLdr));
  // Serial.println(temperature);
  if (temperature > 30) {
    digitalWrite(bar_g, HIGH);
    digitalWrite(bar_y1, HIGH);
    digitalWrite(bar_y2, HIGH);
    digitalWrite(bar_r, HIGH);
  } else if (temperature > 25) {
    digitalWrite(bar_y1, HIGH);
    digitalWrite(bar_y2, HIGH);
    digitalWrite(bar_r, HIGH);
  } else if (temperature > 18) {
    digitalWrite(bar_y2, HIGH);
    digitalWrite(bar_r, HIGH);
  } else {
    digitalWrite(bar_r, HIGH);
  }
  delay(interval);
}

void resetLeds() {
  digitalWrite(bar_g, LOW);
  digitalWrite(bar_y1, LOW);
  digitalWrite(bar_y2, LOW);
  digitalWrite(bar_r, LOW);
}

float toCelsius(int analogValue) {
  return (float(analogValue) * 5 / (1023)) / 0.01;
}
