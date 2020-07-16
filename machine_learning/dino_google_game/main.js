
/***
 * REFATORAR O CODIGO, TA MUITO ZUADO
 * 
 * pegar o melhor da geração, verificar o alvo que ele esta observando, mapear ações tomadas
 **/

var interval
var contextCanvas

const _genetic = new Genetic()
var actualEra = 1
var _draw
var dinoList = []
var trees = []
var clounds = []
var obstacles = []
var score_to_speed = 0
var to_next_speed = 300
var base_multiple_to_next_speed = 1.5

var _game_speed = BASE_SPEED
var score_to_tree = 0
var object_score = 0
var can_make_clound = false
var plane_score = 0

var best_dino = null
var global_best_dino = null
var alives = 0

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = MAX_WIDTH
    canvas.height = MAX_HEIGHT
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
    can_make_clound = 0
    object_score = 0

    trees = []
    clounds = []
    obstacles = []
}

function update() {
    score_to_speed++
    tryUpSpeed()

    generateObstacles()
    // generateTrees()
    // generateClounds()

    // for (let i = 0; i < trees.length; i++) {
    //     trees[i].update(score_to_speed)
    // }

    // for (let i in clounds) {
    //     clounds[i].update(score_to_speed)
    // }

    for (let i in obstacles) {
        obstacles[i].update(score_to_speed)
    }

    var dino
    var next
    var isBest
    alives = 0
    for (let i in dinoList) {
        isBest = false
        dino = dinoList[i]

        if (best_dino == null || dino.score > best_dino.score) {
            best_dino = dino
            isBest = true
        }

        dino.update()

        if (dino.isAlive) {
            alives++

            next = getNextFromObstacles(dino)

            if (dino.isColiding(next))
                dino.die()
            else
                if (next) {
                    dino.predict(next[0])
                }
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

function generateObstacles() {
    object_score++
    // plane_score++

    var removed = false
    for (let i = 0; i < obstacles.length; i++) {
        const t = obstacles[i]
        if (t.outMap()) {
            obstacles.splice(i, 1)
            i--
            removed = true
        }
    }

    if (obstacles.length == 0 || removed && obstacles.length < 5) {
        var last = (obstacles.length > 0) ? obstacles[obstacles.length - 1] : null

        var distance = (last && last.x >= MAX_WIDTH) ? last.getRight() : MAX_WIDTH
        distance += getDistanceObstacle()
        console.log(distance)

        if (can_make_clound && Math.random() < .3)
            obstacles.push(new Clound(distanc, OBJECT_WIDTH * random(2)))
        else
            obstacles.push(new Tree(distance, OBJECT_WIDTH * random(2)))

        if (object_score >= 500) {
            object_score = (_game_speed > 10) ? 200 : 0
            can_make_clound = true
            const d = obstacles[obstacles.length - 1].getRight() + getDistanceObstacle()
            if (Math.random() > .3)
                obstacles.push(new Tree(d, OBJECT_WIDTH * random(4)))
            else
                obstacles.push(new Clound(d, OBJECT_WIDTH * random(4)))
        }

        // if(plane_score >= 9000){
        //     plane_score = 0
        //     const d = obstacles[obstacles.length - 1].getRight() + getDistanceObstacle()
        //     obstacles.push(new Tree(d, OBJECT_WIDTH * 15))
        // }
    }
}

function generateTrees() {
    score_to_tree++

    var removed = false
    for (let i = 0; i < trees.length; i++) {
        const t = trees[i]
        if (t.outMap()) {
            trees.splice(i, 1)
            i--
            removed = true
        }
    }

    if (trees.length == 0 || removed && trees.length < 5) {
        var lastClound = (clounds.length > 0) ? clounds[clounds.length - 1] : null

        var distance = (lastClound && lastClound.x >= MAX_WIDTH) ? lastClound.getRight() : MAX_WIDTH
        distance += getDistanceObstacle()

        trees.push(new Tree(distance, TREE_WIDTH))

        if (score_to_tree >= 500) {
            trees.push(new Tree(trees[trees.length - 1].getRight() + getDistanceObstacle(), TREE_WIDTH * 2))

            if (score_to_tree >= 1000) {
                score_to_tree = (_game_speed > 10) ? 200 : 0
                // trees.push(new Tree(trees[trees.length - 1].x + getDistanceObstacle(), TREE_WIDTH * 3))
            }
        }
    }
}

function generateClounds() {
    for (let i = 0; i < clounds.length; i++) {
        const t = clounds[i]
        if (t.outMap()) {
            clounds.splice(i, 1)
            i--
        }
    }

    if (clounds.length == 0) {
        const lengthTree = trees.length
        var lastTree = (lengthTree > 0) ? trees[lengthTree - 1] : null

        var distance = (lastTree && lastTree.x >= MAX_WIDTH) ? lastTree.x : MAX_WIDTH
        distance += getDistanceObstacle()

        clounds.push(new Clound(distance))
    }
}

function getDistanceObstacle() {
    // console.log((MIN_ENEMY_DISTANCE * _game_speed / 100))
    return MIN_ENEMY_DISTANCE + ((MIN_ENEMY_DISTANCE * _game_speed / 100) * 2)
}

function tryUpSpeed() {
    if (_game_speed < MAX_SPEED && score_to_speed > to_next_speed) {
        _game_speed++
        to_next_speed *= base_multiple_to_next_speed
        // if (base_multiple_to_next_speed > 1.1)
        //     base_multiple_to_next_speed -= .1
    }
}

function getNextFromObstacles(dino) {
    var next = null
    if (dino) {
        var obstacle
        for (let i in obstacles) {
            obstacle = obstacles[i]
            if (obstacle.x > dino.x) {
                const d = dino.distance(obstacle)
                if (next == null || next[1] > d)
                    next = [obstacle, d]
            }
        }
    }
    return next
}

function getNextObstacle(dino) {
    var nextTree = getNextTree(dino)
    var nextClound = getNextClound(dino)

    if (nextTree == null || (nextClound && nextClound[1] < nextTree[1])) {
        return nextClound
    } else if (nextTree) {
        return nextTree
    }
    return null
}

function getNextTree(dino) {
    var next = null
    var tree
    for (let i in trees) {
        tree = trees[i]
        if (tree.x > dino.x) {
            const d = dino.distance(tree)
            if (next == null || next[1] > d)
                next = [tree, d]
        }
    }
    return next
}

function getNextClound(dino) {
    var next = null
    var clound
    for (let i in clounds) {
        clound = clounds[i]
        if (clound.x > dino.x) {
            const d = dino.distance(clound)
            if (next == null || next[1] > d)
                next = [clound, d]
        }
    }
    return next
}

function random(random) {
    return Math.floor(Math.random() * random + 1)
}

function render() {
    _draw.drawBackground(MAX_WIDTH, MAX_HEIGHT)
    _draw.drawDinos(dinoList)
    // _draw.drawTrees(trees)
    // _draw.drawClounds(clounds)
    _draw.drawObstacles(obstacles)
    _draw.drawBestDinoInfo(best_dino, global_best_dino, getNextFromObstacles(best_dino), alives)
}

function newEra() {
    actualEra++
    stopGame()
    if (actualEra <= ERAS) {
        dinoList = _genetic.envolve(dinoList)

        if (global_best_dino == null || best_dino.score > global_best_dino.score)
            global_best_dino = best_dino
        best_dino = null
        initGame()
    }
}

function stopGame() {
    clearInterval(interval)
}