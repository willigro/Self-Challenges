var contextCanvas
var sizeFont = 16
var createInterval = 80
var switchTextRandom = 50
var sizeMaxList
var espacamento = 5
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = maxWidth
    canvas.height = maxHeight
    contextCanvas = canvas.getContext("2d");
    sizeMaxList = (window.innerHeight / sizeFont) - 1
    matrix()
}

function matrix() {
    var simbolos = createColunsSimbols()
    setInterval(function () {
        drawBackground();
        simbolos.forEach(function (simbolo) {
            simbolo.drawText()
        });
    }, createInterval);
}

function createColunsSimbols() {
    var countLists = maxWidth / sizeFont
    var simbolos = []
    var x
    var countFirstList
    var inicio
    var speed
    for (var lists = 0; lists < countLists; lists++) {
        x = lists * (sizeFont + espacamento)
        countFirstList = getCount(sizeMaxList)
        inicio = random(-200)
        speed = getSpeed(15)
        for (var i = 0; i < countFirstList; i++) {
            simbolos.push(new Simbolo(x, inicio -= sizeFont, speed, i == 0, i))
        }
        var countSecondList = getCount(sizeMaxList - countFirstList)
        inicio -= sizeFont * random(5)

        for (var i = 0; i < countSecondList; i++) {
            simbolos.push(new Simbolo(x, inicio -= sizeFont, speed, i == 0, i))
        }
    }
    return simbolos;
}

function getSpeed(max) {
    var speed = random(max)
    return speed < 5 ? 5 : speed
}

function getCount(max) {
    var count = random(max)
    return count < max / 2 ? max / 2 : count
}

function drawBackground() {
    contextCanvas.clearRect(0, 0, maxWidth, maxHeight)
    contextCanvas.fillStyle = "black";
    contextCanvas.fillRect(0, 0, maxWidth, maxHeight);
}

function random(random) {
    return Math.floor(Math.random() * random + 1)
}

class Simbolo {
    constructor(x, y, speed, first, i) {
        this.first = first && random(10) > 7
        this.x = x
        this.value = 0
        this.y = y
        this.color = Math.floor(255 - i * 5)
        this.color = this.color < 120 ? 120 : this.color
        this.speed = speed;
    }

    drawText() {
        var isSwitch = random(switchTextRandom)
        if (isSwitch > switchTextRandom - 5) {
            this.value = random(15)
            if (isSwitch == switchTextRandom) {
                this.value = random(9);
            } else {
                this.value = String.fromCharCode("0x30A0" + random(96));
            }
        }
        this.y = this.y > maxHeight ? 0 : this.y += this.speed
        if (this.first) {
            contextCanvas.fillStyle = "#ffffff"
        } else {
            contextCanvas.fillStyle = 'rgb(60,' + this.color + ',0)';
        }
        contextCanvas.font = sizeFont + "px Consolas"
        contextCanvas.fillText(this.value, this.x, this.y)
    }
}