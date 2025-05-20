/**
 * TODO: lerp speed
 * TODO: improve collision, not all circles in the collision are moving, sometimes only one of (for example) 2 circles is moving, it means that 1 move, but the other keeps its angle
 * TODO: trailing, some visual effect add to the circle path
 * TODO: distortion, what about a "water" effect when colliding
 * TODO: resize when colliding with others
*/
var ctx
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight
const CIRCLES_COUNT = 20
const BASE_COLOR = "white"
const LETTERS = "0123456789ABCDEF"
var _w = []
var _ia = null

// auxiliar
var lastTime;
var requiredElapsed = 1000 / 60;
var _current_intersection = null

function run(now) {
    requestAnimationFrame(run)

    if (!lastTime) { lastTime = now; }
    var elapsed = now - lastTime;
    var delta = 0

    if (elapsed > requiredElapsed) {
        ctx.clearRect(0, 0, maxWidth, maxHeight)

        delta = elapsed / 100
        for (let i = 0; i < _w.length; i++) {
            _w[i].update(_w, delta)
            _w[i].draw()
            _ia.update(_w[i], delta)
        }

        _ia.moveAfterUpdate(delta)

        _ia.draw()

        lastTime = now;
    }
}

window.onload = function () {
    var canvas = document.getElementById("canvas")
    canvas.width = maxWidth
    canvas.height = maxHeight
    ctx = canvas.getContext("2d")

    _ia = new Ia(maxWidth / 2, maxHeight / 2);
    _ia.createRays(-180, 180, 45)

    for (let i = 0; i < CIRCLES_COUNT; i++) {
        _w.push(
            new W(
                newVector(maxWidth / 2, maxHeight / 2),
            )
        )
    }

    run()
}