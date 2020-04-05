var contextCanvas
var delay = 10
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight
const fixedSize = 10

var distanceToCenter = 100

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = maxWidth
    canvas.height = maxHeight
    centerPointX = (maxWidth / 2) - (fixedSize / 2)
    centerPointY = (maxHeight / 2) - (fixedSize / 2)
    contextCanvas = canvas.getContext("2d");
    init()
}

function init() {
    const p = new Point(centerPointX + distanceToCenter, centerPointY + distanceToCenter)
    setInterval(function () {
        drawBackground();
        contextCanvas.fillStyle = "blue";
        contextCanvas.fillRect(centerPointX, centerPointY, fixedSize, fixedSize);
        p.update();
        p.draw();
    }, delay);
}

function drawBackground() {
    contextCanvas.clearRect(0, 0, maxWidth, maxHeight)
    contextCanvas.fillStyle = "black";
    contextCanvas.fillRect(0, 0, maxWidth, maxHeight);
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.a = this.radians(3)
        this.sin = Math.sin(this.a)
        this.cos = Math.cos(this.a)
    }

    update() {
        this.x -= centerPointX;
        this.y -= centerPointY;

        const xnew = (this.x * this.cos) - (this.y * this.sin);
        const ynew = (this.x * this.sin) + (this.y * this.cos);

        this.x = xnew + centerPointX;
        this.y = ynew + centerPointY;
    }

    draw() {
        contextCanvas.fillStyle = "red";
        contextCanvas.fillRect(this.x, this.y, fixedSize, fixedSize);
    }

    radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
}