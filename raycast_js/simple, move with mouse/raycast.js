
var ctx
var delay = 1000 / 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

var fixedSize = 5
var WALL_WIDTH = 200
var WALL_HEIGHT = 200
var LIMIT_WALLS = 10
var FILL = false

var particle
var walls = []

var COLOR_RAY = "white"
const COLOR_PARTICLE = "green"
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

function onMouseMove(event) {
    particle.x = event.screenX
    particle.y = event.screenY
}

function init() {
    setInterval(function () {
        drawBackground();
        for (let w of walls) {
            w.draw()
        }
        particle.draw()
    }, delay);
}

function configure() {
    createWalls()
    createParticle()
}

function prepareGradientLight(x1, y1, x2, y2) {
    if (FILL) return
    COLOR_RAY = ctx.createLinearGradient(x1, y1, x2, y2);
    COLOR_RAY.addColorStop(0, "white");
    COLOR_RAY.addColorStop(1, "black");
}

function createParticle() {
    particle = new Particle(0, 0)
    particle.createRays(-180, 180, .5);
}

function createWalls() {
    for (let i = 0; i < LIMIT_WALLS; i++) {
        walls.push(
            new Wall(
                random(maxWidth / 2),
                random(maxHeight / 2),
                random(maxWidth),
                random(maxHeight))
        )
    }
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

class Wall {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    draw() {
        ctx.strokeStyle = COLOR_WALL
        ctx.beginPath();
        ctx.lineWidth = 1
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.rays = []
    }

    draw() {
        if (FILL) {
            this.drawAndFill()
        } else
            this.drawRays()
    }

    drawRays() {
        for (let r of this.rays) {
            r.update(this.x, this.y)
            r.draw()
        }
    }

    drawAndFill() {
        ctx.beginPath();
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].update(this.x, this.y)
            this.rays[i].draw()
        }
        ctx.lineTo(this.rays[0].dirX, this.rays[0].dirY);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = COLOR_RAY;
        ctx.fill();
    }

    createRays(min, max, each) {
        for (let a = min; a < max; a += each) {
            this.rays.push(new Ray(this.radians(a)));
        }
    }

    radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
}

class Ray {
    constructor(a) {
        this.a = a
        this.cosHandled = 100 * Math.cos(this.a)
        this.sinHandled = 100 * Math.sin(this.a)
    }

    update(x, y) {
        this.x = x
        this.y = y
        this.dirX = this.cosHandled * this.x
        this.dirY = this.sinHandled * this.y
        this.handleTouch()
    }

    handleTouch() {
        this.touch = false
        let selectedT = null
        for (let w of walls) {
            const t = this.intersect(w)
            if (t) {
                this.touch = true
                if (selectedT) {
                    if (this.distance(selectedT[0], selectedT[1]) >
                        this.distance(t[0], t[1])) {
                        selectedT = t
                    }
                } else
                    selectedT = t
            }
        }
        if (this.touch) {
            this.dirX = selectedT[0]
            this.dirY = selectedT[1]
        }
    }

    draw() {
        if (this.touch) {
            ctx.fillStyle = COLOR_TOUCH
            ctx.fillRect(this.dirX, this.dirY, fixedSize, fixedSize)
        } else {
            // console.log(this.dirX, this.dirY)
        }

        ctx.strokeStyle = COLOR_RAY
        if (FILL) {
            ctx.lineTo(this.dirX, this.dirY);
            ctx.stroke();
        } else {
            // prepareGradientLight(this.x, this.y, this.dirX, this.dirY)
            ctx.beginPath();
            // ctx.lineWidth = 1
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.dirX, this.dirY);
            ctx.closePath();
            ctx.stroke();

            // i can apply a force on ray, or simply a loop
            // the each time the color will be summed to a number to be updated to black -> white to black
            // since all rays line will have the same color of the start to end
        }
    }

    intersect(wall) {
        const x1 = wall.x;
        const y1 = wall.y;
        const x2 = wall.x + wall.width;
        const y2 = wall.y + wall.height;

        const x3 = this.x;
        const y3 = this.y;
        const x4 = this.x + this.dirX;
        const y4 = this.y + this.dirY;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
            return [
                x1 + t * (x2 - x1),
                y1 + t * (y2 - y1)
            ]
        } else {
            return;
        }
    }

    distance(x, y) {
        return Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        )
    }
}