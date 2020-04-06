var contextCanvas
var delay = 1000 / 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight
const fixedSize = 4

var distanceToCenter = 100
const thunders = []
var centerPointX = 0
var centerPointY = 0

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
        thunders.push(new Thunder(centerPointX, 0))

    // use to test
    // setInterval(function () {
    //     render()
    // }, delay);
    render()
}

function render() {
    drawBackground();

    for (t of thunders) {
        t.updateAndDraw();
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

class Thunder {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    updateAndDraw() {
        const vertex = random(20)
        
        for (let i = 0; i < vertex; i++) {
            
        }

        contextCanvas.fillStyle = "blue";
        contextCanvas.fillRect(this.x, this.y, fixedSize, fixedSize);
    }
}