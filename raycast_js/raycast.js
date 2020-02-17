
var ctx
var delay = 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

var fixedSize = 10
var WALL_WIDTH = 2
var WALL_HEIGHT = 100

var particle
var walls = []

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

function createParticle() {
    particle = new Particle(0, 0)
    particle.createRays(-180, 180, 20);
    ctx.strokeStyle = "blue"
}

function createWalls() {
    walls.push(new Wall(50, 100, WALL_WIDTH, WALL_HEIGHT))
    walls.push(new Wall(300, 100, WALL_WIDTH, WALL_HEIGHT))
    walls.push(new Wall(300, 400, WALL_WIDTH, WALL_HEIGHT))
    walls.push(new Wall(150, 400, WALL_WIDTH, WALL_HEIGHT))
    walls.push(new Wall(800, 400, WALL_WIDTH, WALL_HEIGHT))
}

function drawBackground() {
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, maxWidth, maxHeight)
}

class Wall {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    draw() {
        ctx.fillStyle = "white"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.rays = []
    }

    draw() {
        // ctx.fillStyle = "green"
        // ctx.fillRect(this.x, this.y, fixedSize, fixedSize)
        for (let r of this.rays) {
            r.update(this.x, this.y)
            r.draw()
        }
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
    }

    update(x, y) {
        this.x = x
        this.y = y
        this.dirX = 100 * Math.cos(this.a) * x
        this.dirY = 100 * Math.sin(this.a) * y

        let first = true
        for (let w of walls) {
            const t = this.intersect(w)
            if (t) {
                ctx.fillStyle = "red"
                if (first) {
                    this.dirX = t[0]
                    this.dirY = t[1]
                } else {
                    if (t[0] < this.dirX)
                        this.dirX = t[0]
                    if (t[1] < this.dirY)
                        this.dirY = t[1]
                }
                first = false
            }
        }
        ctx.fillRect(this.dirX, this.dirY, fixedSize, fixedSize)
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.dirX, this.dirY);
        ctx.closePath();
        ctx.stroke();
    }

    intersect(wall) {
        const x1 = wall.x;
        const y1 = wall.y;
        const x2 = wall.x + WALL_WIDTH;
        const y2 = wall.y + WALL_HEIGHT;

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


    // file:///C:/Users/Trinity/Desktop/Main/my%20repo/self%20challenges/raycast_js/index.html
}