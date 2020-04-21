const int interval = 500;
const int seletor = A3;

// 7 Segments
const int A = A4;
const int B = A5;
const int C = 7;
const int D = 8;
const int E = 5;
const int F = 3;
const int G = 6;

//RGB
const int red = 5;
const int green = 3;
const int blue = 6;

//4 LEDs
const int bar_g = 8;
const int bar_y1 = 7;
const int bar_y2 = A5;
const int bar_r = A4;
void setup() {
  pinMode(3, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(A3, OUTPUT);
  pinMode(A4, OUTPUT);
  pinMode(A5, OUTPUT);
}

void loop() {
  digitalWrite(seletor, LOW);

  // 0
  digitalWrite(A, HIGH);
  digitalWrite(B, HIGH);
  digitalWrite(C, HIGH);
  digitalWrite(D, HIGH);
  digitalWrite(E, HIGH);
  digitalWrite(F, HIGH);
  digitalWrite(G, LOW);
  
  delay(interval);

  // 1
  digitalWrite(A, LOW);
  digitalWrite(B, HIGH);
  digitalWrite(C, HIGH);
  digitalWrite(D, LOW);
  digitalWrite(E, LOW);
  digitalWrite(F, LOW);
  digitalWrite(G, LOW);

  delay(interval);

  // off
  digitalWrite(A, LOW);
  digitalWrite(B, LOW);
  digitalWrite(C, LOW);
  digitalWrite(D, LOW);
  digitalWrite(E, LOW);
  digitalWrite(F, LOW);
  digitalWrite(G, LOW);

  digitalWrite(seletor, HIGH);
  delay(50);

  // in ordering
  digitalWrite(bar_r, HIGH);
  delay(interval);
  digitalWrite(bar_y2, HIGH);
  delay(interval);
  digitalWrite(bar_y1, HIGH);
  delay(interval);
  digitalWrite(bar_g, HIGH);
  delay(interval);

  // blue
  digitalWrite(red, LOW);
  digitalWrite(green, LOW);
  digitalWrite(blue, HIGH);
  delay(interval);
  
   // red
  digitalWrite(red, HIGH);
  digitalWrite(green, LOW);
  digitalWrite(blue, LOW);
  delay(interval);
  
   // green
  digitalWrite(red, LOW);
  digitalWrite(green, HIGH);
  digitalWrite(blue, LOW);
  delay(interval);
}
