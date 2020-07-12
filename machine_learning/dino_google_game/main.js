const DELAY = 1000 / 100
var interval
var contextCanvas
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

const DINO_POPULATION = 500 // 1000 conseguiu
const ERAS = 20

const _genetic = new Genetic()
var actualEra = 1
var _draw
var dinoList = []
var trees = []
var clounds = []
var score_to_speed = 0
var toNexSpeed = 300
var baseMultipleToNextSpeed = 2

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = maxWidth
    canvas.height = maxHeight
    contextCanvas = canvas.getContext("2d");

    _draw = new Draw(contextCanvas)
    INITIAL_X_ENEMY = maxWidth
    initialDinos()
    initGame()
}

function initGame() {
    prepareEnemyObjects()
    interval = setInterval(function () {
        update();
        render();
    }, DELAY);
}

function initialDinos() {
    for (let i = 0; i < DINO_POPULATION; i++) {
        dinoList.push(new Dino())
    }
}

function prepareEnemyObjects() {
    _game_speed = BASE_SPEED
    score_to_speed = 0

    trees = []
    trees.push(new Tree())

    clounds = []
    clounds.push(new Clound())
}

function update() {
    score_to_speed++

    for (let i in trees) {
        trees[i].update(score_to_speed)
    }

    for (let i in clounds) {
        clounds[i].update(score_to_speed)
    }

    var dino
    for (let i in dinoList) {
        dino = dinoList[i]
        dino.update()

        var nextTree
        for (let t in trees) {
            if (!nextTree) {
                nextTree = getNextTree(dino)
            }

            if (dino.isColiding(trees[t]))
                dino.die()
        }

        if (dino.isAlive) {
            var nextClound

            for (let t in clounds) {
                dino = dinoList[i]
                if (!nextTree) {
                    nextClound = getNextClound(dino)
                }

                if (dino.isColiding(clounds[t]))
                    dino.die()
            }

            dino.predict(nextTree, nextClound)
        }
    }

    var allDie = true
    for (let i in dinoList) {
        if (dinoList[i].isAlive) {
            allDie = false
            break
        }
    }

    if (allDie) {
        newEra()
    }
}

function tryUpSpeed() {
    if (_game_speed < 10 && score_to_speed > toNexSpeed) {
        _game_speed++
        toNexSpeed *= baseMultipleToNextSpeed
        baseMultipleToNextSpeed -= .1
        console.log(_game_speed)
    }
}

function getNextTree(dino) {
    for (let i in trees) {
        if (trees[i].x > dino.x) return trees[i]
    }
    return null
}

function getNextClound(dino) {
    for (let i in clounds) {
        if (clounds[i].x > dino.x) return clounds[i]
    }
    return null
}

function render() {
    _draw.drawBackground(maxWidth, maxHeight)
    _draw.drawDinos(dinoList)
    _draw.drawTrees(trees)
    _draw.drawClounds(clounds)
}

function newEra() {
    actualEra++
    stopGame()
    if (actualEra <= ERAS) {
        dinoList = _genetic.envolve(dinoList)
    } else {
        console.log("best", _genetic.best)
    }
    initGame()
}

function stopGame() {
    clearInterval(interval)
}