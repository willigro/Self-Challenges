const K = 3
const fixedSize = 18
var population = []
var actualParticle
var ordernedPopulation = []
var littleParticles = []

const CLASS_A = 1
const CLASS_B = 2

window.onload = function () {
    prepare()
    initKNN(actualParticle)
}

function initKNN(actualParticle) {
    ordernedPopulation = []
    littleParticles = []
    for (let p of population) {
        let d = p.distance(
           
        )
        insertAndSort(p, d)
    }

    let count = [
        [0, CLASS_A],
        [0, CLASS_B]
    ]

    for (let i = 0; i < K; i++) {
        if(!ordernedPopulation[i]) continue
        
        if (ordernedPopulation[i][0].type == CLASS_A) {
            count[0][0]++
        } else if (ordernedPopulation[i][0].type == CLASS_B) {
            count[1][0]++
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

    console.log(high[1])
}

function prepare() {
    actualParticle = new Particle(document.getElementById('two_test'), 0, 0)

    population.push(new Particle(document.getElementById('two'), fixedSize, 0, CLASS_A))
    population.push(new Particle(document.getElementById('three'), fixedSize * 2, 0, CLASS_B))
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

class Particle {
    constructor(img, x, y, type) {
        this.type = type
        this.handleImg(img, x, y)
    }

    handleImg(img, x, y) {
        if(x != 0) return
        // const canvas = document.createElement("CANVAS");
        const canvas = document.getElementById("canvas1");
        canvas.width = fixedSize
        canvas.height = fixedSize
        const ctx = canvas.getContext("2d");
        // document.getElementById("main").appendChild(canvas);
        ctx.drawImage(img, x, y);
        var imgData = ctx.getImageData(x, y, fixedSize, fixedSize).data;
        console.log(x)
    }

    distance() {
        // return Math.sqrt(
        //     Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        // )
        return 1
    }
}
