var ctx
const delay = 1000 / 30
const maxWidth = window.innerWidth
const maxHeight = window.innerHeight
const fixedSize = 4

const K = 3
const POPULATION_LENGTH = 20
var population = []
var actualParticle
var ordernedPopulation = []
var littleParticles = []

const COLOR_PARTICLE = "red"
const COLOR_BACKGROUND = "black"
const COLOR_CLASS_A = "white"
const COLOR_CLASS_B = "blue"

window.onload = function () {
    var canvas = document.getElementById("canvas")
    canvas.width = maxWidth
    canvas.height = maxHeight
    ctx = canvas.getContext("2d")
    prepare()
    initKNN()
}

function initKNN() {
    ordernedPopulation = []
    littleParticles = []
    for (let p of population) {
        let d = p.distance(
            actualParticle.x,
            actualParticle.y
        )
        p.draw()
        insertAndSort(p, d)
    }

    let a = 0
    let b = 0
    for (let i = 0; i < K; i++) {
        if (ordernedPopulation[i][0].class == 1) {
            a++
        } else {
            b++
        }
        littleParticles.push(ordernedPopulation[i])
    }
    if (a > b)
        actualParticle.color = COLOR_CLASS_A
    else
        actualParticle.color = COLOR_CLASS_B
    actualParticle.draw()
}

function onMouseMove(event) {
    actualParticle.x = event.screenX
    actualParticle.y = event.screenY
    initKNN()
}

function insertAndSort(particle, distance) {
    var leng = ordernedPopulation.length
    if (leng == 0)
        ordernedPopulation.push([particle, distance])
    else {
        var i = 0
        var inserted = false
        while (i < leng) {
            if (distance < ordernedPopulation[i][1]) {
                ordernedPopulation.splice(i, 0, [particle, distance]);
                inserted = true;
                break;
            }

            i++;
        }
        if (!inserted)
            ordernedPopulation.push([particle, distance])
    }
}

function prepare() {
    drawBackground()
    actualParticle = new Particle(
        random(maxWidth),
        random(maxHeight),
        "red"
    )
    for (let i = 0; i < POPULATION_LENGTH; i++) {
        population.push(new Particle(
            random(maxWidth),
            random(maxHeight)
        ))
    }
}

function random(value) {
    return Math.floor(Math.random() * value)
}

function drawBackground() {
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    ctx.fillStyle = COLOR_BACKGROUND
    ctx.fillRect(0, 0, maxWidth, maxHeight)
}

class Particle {
    constructor(x, y, selected) {
        this.x = x
        this.y = y
        this.selected = selected
        if (this.distance(maxWidth / 2, maxHeight / 2) < 400) {
            this.class = 1
            this.color = COLOR_CLASS_A
        } else {
            this.class = 0
            this.color = COLOR_CLASS_B
        }
        if (selected) this.color = COLOR_PARTICLE
    }

    distance(x, y) {
        return Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        )
    }

    draw() {
        ctx.fillStyle = this.color
        let s = fixedSize
        if (this.selected)
            s *= 2
        ctx.fillRect(this.x, this.y, s, s)
    }
}
