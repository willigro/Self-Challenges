
/***
 * REFATORAR O CODIGO, TA MUITO ZUADO
 * 
 * pegar o melhor da geração, verificar o alvo que ele esta observando, mapear ações tomadas
 **/

var interval
var contextCanvas

const _genetic = new Genetic()
const _obstacle = new Obstacle()
var actualEra = 1
var _draw
var birdList = []
var score_to_speed = 0
var to_next_speed = 300
var base_multiple_to_next_speed = 1.5

var _game_speed = BASE_SPEED

var best = null
var global_best = null
var alives = 0

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = MAX_WIDTH
    canvas.height = MAX_HEIGHT
    contextCanvas = canvas.getContext("2d");

    _draw = new Draw(contextCanvas)
    initialBirds()
    initGame()
}

function initGame() {
    prepareEnemyObjects()
    interval = setInterval(function () {
        update();
        render();
    }, DELAY);
}

function initialBirds() {
    for (let i = 0; i < POPULATION; i++) {
        birdList.push(new Bird())
    }
}

function prepareEnemyObjects() {
    _game_speed = BASE_SPEED
    score_to_speed = 0
    _obstacle.init()
}

function update() {
    score_to_speed++
    tryUpSpeed()

    _obstacle.generateObstacles()
    _obstacle.update(score_to_speed)

    var bird
    var next
    var isBest
    alives = 0
    for (let i in birdList) {
        isBest = false
        bird = birdList[i]

        if (best == null || bird.score > best.score) {
            best = bird
            isBest = true
        }

        bird.update()

        if (bird.isAlive) {
            alives++

            next = _obstacle.getNextFromObstacles(bird)

            if (bird.isColiding(next))
                bird.die()
            else
                if (next) {
                    bird.predict(next[0])
                }
        }
    }

    var allDie = true
    for (let i in birdList) {
        if (birdList[i].isAlive) {
            allDie = false
            break
        }
    }

    if (allDie) {
        newEra()
    }
}

function tryUpSpeed() {
    if (_game_speed < MAX_SPEED && score_to_speed > to_next_speed) {
        _game_speed++
        to_next_speed *= base_multiple_to_next_speed
    }
}

function random(random) {
    return Math.floor(Math.random() * random + 1)
}

function render() {
    _draw.drawBackground(MAX_WIDTH, MAX_HEIGHT)
    _draw.drawBirds(birdList)
    _draw.drawObstacles(_obstacle.obstacles)
    _draw.drawBestDinoInfo(best, global_best, _obstacle.getNextFromObstacles(best), alives)
}

function newEra() {
    actualEra++
    stopGame()
    if (actualEra <= ERAS) {
        birdList = _genetic.envolve(birdList)

        if (global_best == null || best.score > global_best.score)
            global_best = best
        best = null
        initGame()
    }
}

function stopGame() {
    clearInterval(interval)
}