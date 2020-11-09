var ctx
var delay = 1000 / 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

var fixedSize = 5

var stars = []

const CLOSE_TO_WALL = 10
const TO_CLOSE = 150
const START_COUNT = 10
const COLOR_BACKGROUND = "black"
const COLOR_STAR = "white"

window.onload = function() {
    var canvas = document.getElementById("canvas")
    canvas.width = maxWidth
    canvas.height = maxHeight
    ctx = canvas.getContext("2d")
    configure()
    init()
}

function onMouseMove(event) {
    for (var i = 0; i < stars.length; i++) {
        const s = stars[i]
        if (s.distance(event.screenX, event.screenY) < TO_CLOSE) {
            s.moveAway(event.screenX, event.screenY)
        } else {
            s.stop()
        }
    }
}

function init() {
    setInterval(function() {
        drawBackground();
        for (let s of stars) {
            s.draw()
        }
    }, delay);
}

function configure() {
    for (var i = 0; i < START_COUNT; i++) {
        stars.push(new Star(random(maxWidth), random(maxHeight)))
    }
}

function drawBackground() {
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    ctx.fillStyle = COLOR_BACKGROUND
    ctx.fillRect(0, 0, maxWidth, maxHeight)
}

function random(limit) {
    return Math.floor(Math.random() * limit)
}

class Star {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.active = false
        this.horizontal = 0
        this.vertical = 0
    }

    moveAway(x, y) {
        if (!this.active) {
            this.active = true
            this.horizontal = (random(2) > 0) ? 1 : -1
            this.vertical = (random(2) > 0) ? 1 : -1
        }

        if (this.x - CLOSE_TO_WALL < 0 || this.x > CLOSE_TO_WALL > maxWidth) {
            this.horizontal *= -1
        }

        if (this.y - CLOSE_TO_WALL < 0 || this.y > CLOSE_TO_WALL > maxHeight) {
            this.vertical *= -1
        }

        this.x += this.horizontal
        this.y += this.vertical
    }

    stop() {
        this.active = false
    }

    draw() {
        ctx.fillStyle = COLOR_STAR
        ctx.fillRect(this.x, this.y, fixedSize, fixedSize)
    }

    distance(x, y) {
        return Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        )
    }
}