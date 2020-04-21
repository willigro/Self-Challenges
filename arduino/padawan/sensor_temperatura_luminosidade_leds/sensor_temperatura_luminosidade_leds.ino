const int interval = 500;
const int seletor = A3;

//4 LEDs
const int bar_g = 8;
const int bar_y1 = 7;
const int bar_y2 = A5;
const int bar_r = A4;

//RGB
const int red = 5;
const int green = 3;
const int blue = 6;

// Sensors
const int pinLDR = A1;
const int pinLM = A0;

int temperature = 0;
int luminosity = 0;

void setup() {
  // Serial.begin(9600);
  digitalWrite(seletor, HIGH);

  pinMode(bar_g, OUTPUT);
  pinMode(bar_y1, OUTPUT);
  pinMode(bar_y2, OUTPUT);
  pinMode(bar_r, OUTPUT);
  pinMode(seletor, OUTPUT);

  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);
}

void loop() {
  resetLeds();
  handleLuminosity();
  handleTemperature();
  delay(interval);
}

void handleLuminosity() {
  luminosity = analogRead(pinLDR);
  // Serial.println(luminosity);
  if (luminosity > 200) {
    digitalWrite(red, HIGH);
  } else if (luminosity > 150) {
    digitalWrite(green, HIGH);
  } else {
    digitalWrite(blue, HIGH);
  }
}

void handleTemperature() {
  temperature = toCelsius(analogRead(pinLM));
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
}

void resetLeds() {
  digitalWrite(bar_g, LOW);
  digitalWrite(bar_y1, LOW);
  digitalWrite(bar_y2, LOW);
  digitalWrite(bar_r, LOW);

  digitalWrite(red, LOW);
  digitalWrite(blue, LOW);
  digitalWrite(green, LOW);
}

float toCelsius(int analogValue) {
  return (float(analogValue) * 5 / (1023)) / 0.01;
}
