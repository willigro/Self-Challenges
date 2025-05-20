var ctx
var delay = 1000 / 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight
var maxDistanceToCenter = 0

var stars = []

const centerX = maxWidth / 2
const centerY = maxHeight / 2

const MAX_VEL = 3
const MIN_VEL = 1
const ACELARATION = .1

const TURNS_TO_GO_TO_CENTER = 25
const STAR_MAX_SIZE = 1.7
const CLOSE_TO_WALL = 10
const TO_CLOSE = 100
const START_COUNT = 2000
const MAX_RADIUS = 100000

const COLOR_BACKGROUND = "black"
const COLOR_STAR_WHITE = "white"
const COLOR_STAR_ORANGE = "#FC9601"
const COLOR_STAR_YELLOW = "#FFCC33"
const COLOR_STAR_RED = "#D14009"
const COLOR_STAR_BLUE = "#210bc3"

const MOVE_STATUS_RUN_AWAY = 1
const MOVE_STATUS_STOPING = 2
const MOVE_STATUS_TO_CENTER = 3

var _blackHole;

window.onload = function() {
    var canvas = document.getElementById("canvas")
    canvas.width = maxWidth
    canvas.height = maxHeight
    ctx = canvas.getContext("2d")
    configure()
    init()
}

function onMouseMove(event) {
    const x = event.pageX
    const y = event.pageY
    for (var i = 0; i < stars.length; i++) {
        const s = stars[i]
        if (s.distance(x, y) > TO_CLOSE) {
            s.stop()
        } else {
            s.runAway(x, y)
        }
    }
}

function OnMouseDown(event) {
    if (!_blackHole) return
    _blackHole.x = event.pageX
    _blackHole.y = event.pageY
}

function init() {
    setInterval(function() {
        drawBackground();
        _blackHole.draw()
        for (let s of stars) {
            s.update()
        }

    }, delay);
}

function configure() {
    _blackHole = new BlackHole()
    for (var i = 0; i < START_COUNT; i++) {
        stars.push(new Star(random(maxWidth), random(maxHeight), i))
            // stars.push(new Star(centerX + 100, centerY + 3))
    }

    maxDistanceToCenter = distance(0, 0, centerX, centerY)
}

function drawBackground() {
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    ctx.fillStyle = COLOR_BACKGROUND
    ctx.fillRect(0, 0, maxWidth, maxHeight)
}

function random(limit) {
    return Math.floor(Math.random() * limit)
}

function randomMin(min, max) {
    return Math.floor(Math.random() * max) + min
}

function randomNotZero(limit) {
    const r = Math.floor(Math.random() * limit)
    if (r == 0 && Math.random() > .9) return limit
    return (r == 0) ? 1 : r
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    )
}

function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue
}

function valueFromPercentage(percent, totalValue) {
    return percent * totalValue / 100
}

class BlackHole {
    constructor() {
        this.x = centerX
        this.y = centerY
        this.m = 1.989 * Math.pow(10, 30)
        this.r = 212244.432
        this.size = STAR_MAX_SIZE * 2
    }

    draw() {
        ctx.fillStyle = "rgb(200, 200, 200)"
            // ctx.fillRect(this.x, this.y, this.size, this.size)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

class Star {
    constructor(x, y, position) {
        this.x = x
        this.y = y
        this.rx = x
        this.ry = y
        this.position = position
        this.horizontal = 0
        this.vertical = 0
        this.vel = MIN_VEL
        this.color = this.randomStarColor()

        this.moveStatus = MOVE_STATUS_TO_CENTER
        this.turnsToStop = 0

        this.r = randomMin(1, MAX_RADIUS)
        this.size = valueFromPercentage(percentage(this.r, MAX_RADIUS), STAR_MAX_SIZE)
        if (this.size == 0) this.size = 0.5

        this.velX = 0
        this.velY = 0

        this.g = 6.6742e-11
    }

    function(val, max, min) { return (val - min) / (max - min); }

    update() {
        // if (this.insideCenter) return

        this.draw()
        this.tryMoveToCenter()
    }

    randomStarColor() {
        const r = Math.random()
        if (r < .8) return COLOR_STAR_WHITE
        if (r < .85) return COLOR_STAR_ORANGE
        if (r < .9) return COLOR_STAR_YELLOW
        if (r < .95) return COLOR_STAR_RED
        return COLOR_STAR_BLUE
    }

    runAway(x, y) {
        this.insideCenter = false

        if (this.moveStatus != MOVE_STATUS_RUN_AWAY) {
            this.horizontal = (Math.random() > .5) ? 1 : -1
            this.vertical = (Math.random() > .5) ? 1 : -1

            this.moveStatus = MOVE_STATUS_RUN_AWAY
        }

        this.applyForce()

        if (this.closeToSideWalls()) {
            this.horizontal *= -1
        }

        if (this.closeToTopBottomWalls()) {
            this.vertical *= -1
        }

        this.move()
    }

    move() {
        if (this.moveStatus == MOVE_STATUS_RUN_AWAY) {
            this.x += this.horizontal * this.vel
            this.y += this.vertical * this.vel
        } else {
            this.orbit()
        }
    }

    orbit() {
        // mass1 = sun mass2 = earth
        // radius distance
        // const centripetalForce = mass * acceleration
        // const acceleration = Math.pow(velocityToPow, 2) / radius
        // const gravitation = gravity * (mass1 * mass2 / Math.pow(radius, 2))
        // const v2 = gravity * mass1 / radius
        // const velocity = Math.sqrt(gravity * mass1 / radius)
        const rdt = 1
        const dt = .000000001
        const r = _blackHole.r * dt + this.r * dt + distance(this.rx, this.y, _blackHole.x, _blackHole.y)
        const velocity = Math.sqrt(6.6742e-11 * dt * _blackHole.m * dt / r) // m * .000000000001
        this.rx += velocity * rdt * Math.cos(r) - Math.sin(r)
        this.ry += velocity * rdt * Math.sin(r) + Math.cos(r)
        this.x = this.rx
        this.y = this.ry
            // if (this.position == 0)
            // if (this.x > maxWidth || this.x < 0)
            //     console.log(this.x, this.y, maxWidth, maxHeight, velocity, this.position)
    }

    // There is not delay, so i can put the max or min value without aceleration
    applyForce() {
        this.vel = MAX_VEL
    }

    stop() {
        if (this.moveStatus == MOVE_STATUS_RUN_AWAY)
            this.moveStatus = MOVE_STATUS_STOPING
    }

    stopping() {
        this.vel = MIN_VEL
        this.turnsToStop += 1
        if (this.turnsToStop == TURNS_TO_GO_TO_CENTER) {
            this.turnsToStop = 0
            this.moveStatus = MOVE_STATUS_TO_CENTER
        }
    }

    tryMoveToCenter() {
        if (this.moveStatus == MOVE_STATUS_RUN_AWAY) return

        if (this.moveStatus == MOVE_STATUS_STOPING) {
            this.stopping()
            this.move()
            return
        }

        const percentToCenter = percentage(this.distance(centerX, centerY), maxDistanceToCenter)
        this.angle = valueFromPercentage(100 - percentToCenter, 20)

        this.setDirectionToCenter()

        if (percentToCenter < .3) {
            this.insideCenter = true
            console.log("inside")
        }

        this.vel = valueFromPercentage(100 - percentToCenter, MAX_VEL)

        if (this.vel < MIN_VEL) {
            this.vel = MIN_VEL
        }

        if (this.vel > MAX_VEL) {
            this.vel = MAX_VEL
        }

        this.move()
    }

    setDirectionToCenter() {
        if (this.leftTo(centerX)) {
            this.horizontal = 1
        } else {
            this.horizontal = -1
        }

        if (this.topTo(centerY)) {
            this.vertical = 1
        } else {
            this.vertical = -1
        }

        if (this.closeToSideWalls()) {
            this.horizontal *= -1
        }

        if (this.closeToTopBottomWalls()) {
            this.vertical *= -1
        }
    }

    closeToSideWalls() {
        return this.x - CLOSE_TO_WALL < 0 || this.x > CLOSE_TO_WALL > maxWidth
    }

    closeToTopBottomWalls() {
        return this.y - CLOSE_TO_WALL < 0 || this.y > CLOSE_TO_WALL > maxHeight
    }

    leftTo(x) {
        return this.x < x
    }

    rightTo(x) {
        return this.x > x
    }

    topTo(y) {
        return this.y < y
    }

    bottomTo(y) {
        return this.y > y
    }

    draw() {
        if (this.x > 0 && this.x < maxWidth && this.y > 0 && this.y < maxHeight) {
            ctx.fillStyle = this.color
                // ctx.fillRect(this.x, this.y, this.size, this.size)
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    distance(x, y) {
        return Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        )
    }
}