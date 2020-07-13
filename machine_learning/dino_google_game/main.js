var DELAY = 1000 / 100
var interval
var contextCanvas
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

const DINO_POPULATION = 100 // 1000 conseguiu
const ERAS = 20
const MAX_SPEED = 15

const _genetic = new Genetic()
var actualEra = 1
var _draw
var dinoList = []
var trees = []
var clounds = []
var score_to_speed = 0
var to_next_speed = 300
var base_multiple_to_next_speed = 2

var score_to_tree = 0
var score_to_clound = 0

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = maxWidth
    canvas.height = maxHeight
    contextCanvas = canvas.getContext("2d");

    _draw = new Draw(contextCanvas)
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
    score_to_tree = 0

    trees = []
    clounds = []
}

function update() {
    score_to_speed++

    handleTrees()
    // handleClounds()

    for (let i = 0; i < trees.length; i++) {
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

function handleTrees() {
    score_to_tree++

    for (let i = 0; i < trees.length; i++) {
        const t = trees[i]
        if (t.outMap()) {
            trees.splice(i, 1)
            i--
        }
    }

    if (trees.length == 0) {
        var lastClound
        for (let c in clounds) {
            lastClound = clounds[c]
        }
        if (lastClound) {
            trees.push(new Tree())
        } else {
            trees.push(new Tree(maxWidth))
        }
        // if (score_to_tree >= 500) {
        //     trees.push(new Tree(trees[0].width + trees[0].x + 1))

        //     if (score_to_tree >= 1000) {
        //         score_to_tree = 0
        //         trees.push(new Tree(trees[1].width + trees[1].x + 1))
        //     }
        // }
        // console.log(trees.length, score_to_tree)
    }
}

function handleClounds() {
    score_to_clound++

    for (let i = 0; i < clounds.length; i++) {
        const t = clounds[i]
        if (t.outMap()) {
            clounds.splice(i, 1)
            i--
        }
    }

    if (clounds.length == 0) {
        const x = (trees.length > 0) ? trees[0].x : maxWidth

        clounds.push(new Clound(x))
        if (score_to_clound >= 1000) {
            clounds.push(new Clound(clounds[0].width + clounds[0].x + 1))

            if (score_to_clound >= 2000) {
                score_to_clound = 0
                clounds.push(new Clound(clounds[1].width + clounds[1].x + 1))
            }
        }
    }
}

function tryUpSpeed() {
    if (_game_speed < MAX_SPEED && score_to_speed > to_next_speed) {
        _game_speed++
        to_next_speed *= base_multiple_to_next_speed
        if (base_multiple_to_next_speed > 1.5)
            base_multiple_to_next_speed -= .1
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
    }
    initGame()
}

function stopGame() {
    clearInterval(interval)
}