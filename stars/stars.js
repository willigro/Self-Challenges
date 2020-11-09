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
const STAR_MAX_SIZE = 2
const CLOSE_TO_WALL = 10
const TO_CLOSE = 100
const START_COUNT = 1

const COLOR_BACKGROUND = "black"
const COLOR_STAR_WHITE = "white"
const COLOR_STAR_ORANGE = "#FC9601"
const COLOR_STAR_YELLOW = "#FFCC33"
const COLOR_STAR_RED = "#D14009"
const COLOR_STAR_BLUE = "#210bc3"

const MOVE_STATUS_RUN_AWAY = 1
const MOVE_STATUS_STOPING = 2
const MOVE_STATUS_TO_CENTER = 3

window.onload = function () {
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

function init() {
    setInterval(function () {
        drawBackground();
        for (let s of stars) {
            s.update()
        }
    }, delay);
}

function configure() {
    for (var i = 0; i < START_COUNT; i++) {
        // stars.push(new Star(random(maxWidth), random(maxHeight)))
        stars.push(new Star(centerX + 100, centerY + 100))
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

class Star {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.horizontal = 0
        this.vertical = 0
        this.vel = MIN_VEL
        this.size = 5//randomNotZero(STAR_MAX_SIZE)
        this.color = this.randomStarColor()

        this.moveStatus = MOVE_STATUS_TO_CENTER
        this.turnsToStop = 0

        this.insideCenter = false
        this.angle = 0
        this.a = randomNotZero(20)

        const dX = this.x - centerX;
        const dY = this.y - centerY;
        this.angle = Math.atan2(dY, dX);
        this.r = this.distance(centerX, centerY)
    }

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
        this.x += this.horizontal * this.vel
        this.y += this.vertical * this.vel
        // if (this.moveStatus == MOVE_STATUS_RUN_AWAY) {
        //     this.x += this.horizontal * this.vel
        //     this.y += this.vertical * this.vel
        // } else {
        //     // const a = 20
        //     // console.log(this.a, this.x, this.y)
        //     // this.x += ((this.a * this.angle) * Math.cos(this.angle)) / centerX
        //     // this.y += ((this.a * this.angle) * Math.sin(this.angle)) / centerY

        //     // this.x -= this.a * this.angle * Math.cos(this.angle + Math.PI) + (Math.random() * centerX) * 0.1
        //     // this.y -= this.a * this.angle * Math.sin(this.angle + Math.PI) + (Math.random() * centerY) * 0.1

        //     // this.x += this.vel * this.horizontal - ((this.a * this.angle) * Math.cos(this.angle) / centerX)
        //     // this.y += this.vel * this.vertical - ((this.a * this.angle) * Math.sin(this.angle) / centerY)

        //     // angle of line between point and center of screen 
        //     // relative to x-axis


        //     // this.x = this.r * Math.cos(this.angle) + centerX;
        //     // this.y = this.r * Math.sin(this.angle) + centerY;

        //     // if (this.r > 0) {
        //     //     this.r -= this.vel
        //     //     this.theta += Math.random(); // Increment the angle
        //     // }

        //     // A radius between the gravitating bodies is computed: (1) r=x2+y2+z2−−−−−−−−−−√
        //     // A gravitational force scalar is computed: (2) f=−GM1M2r2
        //     // G = Universal gravitational constant
        //     // M1 = mass of body 1
        //     // M2 = mass of body 2
        //     // r = radius obtained from equation (1)
        //     // A normalized direction vector (or unit vector) is computed to provide a direction for the gravitational force scalar: (3) r^{x,y,z}={x,y,z}x2+y2+z2√
        //     // The velocity vector is updated by gravitational acceleration multiplied by the unit vector: (4) v⃗ t+1=v⃗ t+r^fΔt
        //     // The position vector is updated by velocity: (5) p⃗ t+1=p⃗ t+v⃗ t+1Δt
        //     // The updated position is plotted on an output device and the process is repeated.

        //     // const radius = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
        //     // const radius = this.distance(centerX, centerY)
        //     // const e = (5.972 * Math.pow(10, 24))
        //     // const s = (1.989 * Math.pow(10, 30))
        //     // const r = Math.pow(radius, 2)
        //     // const g = 6.6742e-11
        //     // // console.log(e, s, r)
        //     // const gravit = -(g * e * s / r)
        //     // // const x = this.x / radius
        //     // // const y = this.y / radius
        //     // // const vel = this.vel * ACELARATION * gravit
        //     // console.log(gravit, this.x, this.horizontal, this.vel)
        //     // this.x += gravit * this.horizontal * this.vel
        //     // this.y += gravit * this.vertical * this.vel
        // }
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
        ctx.fillStyle = this.color
        // ctx.fillRect(this.x, this.y, this.size, this.size)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    distance(x, y) {
        return Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        )
    }
}