var contextCanvas
var delay = 1000 / 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight
const fixedSize = 4

var distanceToCenter = 100
const points = []

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
    for (let i = 0, leng = 10; i < leng; i++)
        points.push(new Point(centerPointX + distanceToCenter, centerPointY + distanceToCenter))

        // use to test
    // setInterval(function () {
    //      render()
    // }, delay);
    render()
}

function render() {
    drawBackground();
    contextCanvas.fillStyle = "red";
    contextCanvas.fillRect(centerPointX, centerPointY, fixedSize, fixedSize);
    for (p of points) {
        p.update();
        p.draw();
    }
    // comment when in test
    requestAnimationFrame(render)
}

function drawBackground() {
    contextCanvas.clearRect(0, 0, maxWidth, maxHeight)
    contextCanvas.fillStyle = "black";
    contextCanvas.fillRect(0, 0, maxWidth, maxHeight);
}

function random(limit) {
    return Math.floor(Math.random() * limit)
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
        this.x += random(3);
        this.y += random(3);
        this.x -= centerPointX;
        this.y -= centerPointY;

        const xnew = (this.x * this.cos) - (this.y * this.sin);
        const ynew = (this.x * this.sin) + (this.y * this.cos);

        this.x = xnew + centerPointX;
        this.y = ynew + centerPointY;
    }

    draw() {
        contextCanvas.fillStyle = "blue";
        contextCanvas.fillRect(this.x, this.y, fixedSize, fixedSize);
    }

    radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
}