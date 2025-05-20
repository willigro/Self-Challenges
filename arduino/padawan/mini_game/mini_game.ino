#include <Thread.h>
#include <ThreadController.h>

int pins[7] = {A4, A5, 7, 8, 5, 3, 6};
byte seven_seg_digits[10][7] = {
  {1, 1, 1, 1, 1, 1, 0}, //0
  {0, 1, 1, 0, 0, 0, 0}, //1
  {1, 1, 0, 1, 1, 0, 1}, //2
  {1, 1, 1, 1, 0, 0, 1}, //3
  {0, 1, 1, 0, 0, 1, 1}, //4
  {1, 0, 1, 1, 0, 1, 1}, //5
  {0, 0, 1, 1, 1, 1, 1}, //6
  {1, 1, 1, 0, 0, 0, 0}, //7
  {1, 1, 1, 1, 1, 1, 1}, //8
  {1, 1, 1, 0, 0, 1, 1}  //9
};

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
const int button = 2;

const int seletor = A3;

Thread colorThread = Thread();
Thread buttonThread = Thread();
ThreadController threadController = ThreadController();

int state = 0;
int goalColor;
int actual_lifes = 4;
int points = 0;
boolean changed = false;

void setup() {
  Serial.begin(9600);

  int i = 0;
  while (i < 7) {
    pinMode(pins[i], OUTPUT);
    i++;
  }

  pinMode(seletor, OUTPUT);
  pinMode(button, INPUT_PULLUP);

  colorThread.onRun(changeGoalColor);
  colorThread.setInterval(500);

  buttonThread.onRun(checkClick);
  buttonThread.setInterval(1);

  initGame();
}

void loop() {
  checkLife();
  threadController.run();
}

void initThreadController() {
  threadController.add(&colorThread);
  threadController.add(&buttonThread);
}

void initGame() {
  actual_lifes = 4;
  points = 0;
  initThreadController();
}

void checkClick() {
  if (changed) {
    while (digitalRead(button)) {
      if (state == 0) {
        changed = false;
        if (goalColor == 0) {
          sumLife();
        } else
          lessLife();
        state++;
      }
    }
    state = 0;
  }
}

void changeGoalColor() {
  resetGoalColor();

  goalColor = random(3);
  switch (goalColor) {
    case 0:
      digitalWrite(red, HIGH);
      break;
    case 1:
      digitalWrite(green, HIGH);
      break;
    default:
      digitalWrite(blue, HIGH);
      break;
  }
  changed = true;
}

void sumLife() {
  if (points == 9) {
    winGame();
    return;
  }

  threadController.clear();

  points++;
  digitalWrite(seletor, LOW);
  for (int i = 0; i < 7; i++) {
    digitalWrite(pins[i], seven_seg_digits[points][i]);
  }

  delay(300);

  if (actual_lifes < 4)
    actual_lifes++;

  initThreadController();
}

void lessLife() {
  actual_lifes--;
  if (actual_lifes == 0) {
    endGame();
  }
}

void checkLife() {
  digitalWrite(seletor, HIGH);
  resetLifes();
  switch (actual_lifes) {
    case 4:
      digitalWrite(bar_g, HIGH);
      digitalWrite(bar_y1, HIGH);
      digitalWrite(bar_y2, HIGH);
      digitalWrite(bar_r, HIGH);
      break;
    case 3:
      digitalWrite(bar_y1, HIGH);
      digitalWrite(bar_y2, HIGH);
      digitalWrite(bar_r, HIGH);
      break;
    case 2:
      digitalWrite(bar_y2, HIGH);
      digitalWrite(bar_r, HIGH);
      break;
    case 1:
      digitalWrite(bar_r, HIGH);
      break;
  }
}

void resetGoalColor() {
  digitalWrite(red, LOW);
  digitalWrite(blue, LOW);
  digitalWrite(green, LOW);
}

void turnOnWhiteColor() {
  digitalWrite(red, HIGH);
  digitalWrite(blue, HIGH);
  digitalWrite(green, HIGH);
}

void resetLifes() {
  digitalWrite(bar_g, LOW);
  digitalWrite(bar_y1, LOW);
  digitalWrite(bar_y2, LOW);
  digitalWrite(bar_r, LOW);
}

void endGame() {
  threadController.clear();
  count();
  initGame();
}

void winGame() {
  threadController.clear();
  for (int i = 0; i < 5; i++) {
    resetGoalColor();
    delay(100);
    turnOnWhiteColor();
    delay(100);
  }
  count();
  initGame();
}

void count() {
  digitalWrite(seletor, LOW);
  for (int p = 0; p < 10; p++) {
    for (int i = 0; i < 7; i++) {
      digitalWrite(pins[i], seven_seg_digits[p][i]);
    }
    delay(150);
  }
}
