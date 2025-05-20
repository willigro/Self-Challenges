var ctx
var delay = 1000 / 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

var fixedSize = 5
var WALL_WIDTH = 200
var WALL_HEIGHT = 200
var LIMIT_WALLS = 10

var enamy
var walls = []

var COLOR_RAY = "white"
const COLOR_ENAMY = "green"
const COLOR_TOUCH = "red"
const COLOR_BACKGROUND = "black"
const COLOR_WALL = "blue"

window.onload = function () {
    var canvas = document.getElementById("canvas")
    canvas.width = maxWidth
    canvas.height = maxHeight
    ctx = canvas.getContext("2d")
    configure()
    init()
}

function init() {
    setInterval(function () {
        drawBackground();
        for (let w of walls) {
            w.draw()
        }
        enamy.update()
        enamy.draw()
    }, delay);
}

function configure() {
    createWalls()
    createEnamy()
}

function createEnamy() {
    enamy = new Enamy(100, 200)
    enamy.createRays(10, 15, .3);
}

function createWalls() {
    // for (let i = 0; i < LIMIT_WALLS; i++) {
    //     walls.push(
    //         new Wall(
    //             random(maxWidth / 2),
    //             random(maxHeight / 2),
    //             random(maxWidth),
    //             random(maxHeight))
    //     )
    // }
    walls.push(
        new Wall(
            0,
            0,
            maxWidth,
            0)
    )

    walls.push(
        new Wall(
            0,
            0,
            0,
            maxHeight)
    )

    walls.push(
        new Wall(
            maxWidth,
            0,
            0,
            maxHeight)
    )

    walls.push(
        new Wall(
            0,
            maxHeight,
            maxWidth,
            0)
    )
}

function drawBackground() {
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    ctx.fillStyle = COLOR_BACKGROUND
    ctx.fillRect(0, 0, maxWidth, maxHeight)
}

function random(limit) {
    return Math.floor(Math.random() * limit)
}