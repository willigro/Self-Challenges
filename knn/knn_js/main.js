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
const CLASS_NONE = 0
const CLASS_A = 1
const CLASS_B = 2
const CLASS_C = 3

const COLOR_PARTICLE = "orange"
const COLOR_BACKGROUND = "black"
const COLOR_CLASS_A = "white"
const COLOR_CLASS_B = "blue"
const COLOR_CLASS_C = "red"

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

    let count = [
        [0, CLASS_A],
        [0, CLASS_B],
        [0, CLASS_C]
    ]
    
    for (let i = 0; i < K; i++) {
        if (ordernedPopulation[i][0].type == CLASS_A) {
            count[0][0]++
        } else if (ordernedPopulation[i][0].type == CLASS_B) {
            count[1][0]++
        } else if (ordernedPopulation[i][0].type == CLASS_C) {
            count[2][0]++
        }
        littleParticles.push(ordernedPopulation[i])
    }

    let high = 0
    for (let i = 0; i < count.length; i++) {
        if (i == 0) high = count[0]
        else {
            if (count[i][0] > count[i - 1][0]) {
                high = count[i]
            }
        }
    }

    actualParticle.type = high[1]
    actualParticle.defineColor()
    actualParticle.draw()
}

function onMouseMove(event) {
    if (!actualParticle) return
    actualParticle.x = event.screenX
    actualParticle.y = event.screenY
    drawBackground()
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
        true,
        CLASS_NONE
    )
    for (let i = 0; i < POPULATION_LENGTH; i++) {
        population.push(new Particle(
            random(maxWidth),
            random(maxHeight),
            false,
            randomType()
        ))
    }
}

function randomType() {
    const r = Math.random()
    if (r < .3) {
        return CLASS_A
    } else if (r < .6) {
        return CLASS_B
    } else {
        return CLASS_C
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
    constructor(x, y, selected, type) {
        this.x = x
        this.y = y
        this.selected = selected
        this.type = type
        this.defineColor()
    }

    defineColor() {
        if (this.type == CLASS_A) {
            this.color = COLOR_CLASS_A
        } else if (this.type == CLASS_B) {
            this.color = COLOR_CLASS_B
        } else if (this.type == CLASS_C) {
            this.color = COLOR_CLASS_C
        } else
            this.color = COLOR_PARTICLE
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
