var ctx
const delay = 1000 / 30
const maxWidth = 200 // window.innerWidth
const maxHeight = 200 // window.innerHeight
const fixedSize = 6

const K = 3
const POPULATION_LENGTH = 10
var population = []
var actualParticle
var ordernedPopulation = []
var littleParticles = []
const CLASS_NONE = 0
const CLASS_A = 1
const CLASS_B = 2
const CLASS_C = 3


window.onload = function () {
    var canvas = document.getElementById("canvas")
    canvas.width = maxWidth
    canvas.height = maxHeight
    ctx = canvas.getContext("2d")
    prepare()
    initKNN(actualParticle, true)
}

function initKNN(actualParticle, drawPopulation) {
    ordernedPopulation = []
    littleParticles = []
    for (let p of population) {
        let d = p.distance(
            actualParticle.x,
            actualParticle.y
        )
        if (drawPopulation)
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
    actualParticle.x = event.offsetX
    actualParticle.y = event.offsetY
    drawBackground()
    handleParticlesAround()
    initKNN(actualParticle, true)
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

    // for (let i = 0; i < POPULATION_LENGTH; i++) {
    //     population.push(new Particle(
    //         random(maxWidth),
    //         random(maxHeight),
    //         false,
    //         randomType()
    //     ))
    // }

    population.push(new Particle(
        20,
        20,
        false,
        CLASS_A
    ))

    population.push(new Particle(
        60,
        60,
        false,
        CLASS_A
    ))

    population.push(new Particle(
        100,
        100,
        false,
        CLASS_B
    ))

    population.push(new Particle(
        150,
        150,
        false,
        CLASS_B
    ))

    population.push(new Particle(
        180,
        180,
        false,
        CLASS_C
    ))

    handleParticlesAround()
}

function handleParticlesAround() {
    let w = maxWidth / fixedSize
    let h = maxHeight / fixedSize
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            initKNN(
                new Particle(
                    i * fixedSize,
                    j * fixedSize,
                    false,
                    null,
                    true
                ),
                false)
        }
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
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, maxWidth, maxHeight)
}

class Particle {
    constructor(x, y, selected, type, area) {
        this.x = x
        this.y = y
        this.selected = selected
        this.type = type
        this.area = area
        this.defineColor()
    }

    defineColor() {
        if (this.type == CLASS_A) {
            // red
            this.color = "rgb(186, 0, 53)"
            if (this.area) {
                this.color = "rgb(250, 80, 11)"
            }
        }
        else if (this.type == CLASS_B) {
            // green
            this.color = "rgb(6, 140, 21)"
            if (this.area) {
                this.color = "rgb(3, 252, 19)"
            }
        } else if (this.type == CLASS_C) {
            // blue
            this.color = "rgb(33, 0, 242)"
            if (this.area) {
                this.color = "rgb(103, 80, 250)"
            }
        } else
            this.color = "rgb(255, 0, 0)"
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
