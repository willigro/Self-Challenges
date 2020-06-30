const DELAY = 250
var interval
var contextCanvas
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight

const LINE_COLOR = "white"
const BACKGROUND_COLOR = "black"
const INITIAL_COLOR = "red"
const GOAL_COLOR = "grey"
const NEIGHBOURHOODS_COLOR = "blue"
const CURRENT_COLOR = "green"
const LOCKED_COLOR = "yellow"
const PATH_COLOR = "orange"
const CLOSED_COLOR = "brown"

var cell_height
var cell_width

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = maxWidth
    canvas.height = maxHeight
    contextCanvas = canvas.getContext("2d");
    init()
}

function init() {
    cell_height = maxHeight / ROWS
    cell_width = maxWidth / COLS

    // a star
    startGrid(cell_width, cell_height)
    interval = setInterval(function () {
        detectNeighbour()
        render()
        if (isGoal()) {
            clearInterval(interval)
            drawPath()
        }
    }, DELAY);
}

function render() {
    contextCanvas.textAlign = "center"
    contextCanvas.font = "15px Arial"

    drawBackground()
    drawGrid()

    drawGoalNode()
    drawNeighbourNodes()
    drawCurrentNode()
    drawInitialNode()
    drawClosedNodes()

    drawAllCosts()
    drawLockeds()
}

function drawLockeds() {
    contextCanvas.fillStyle = LOCKED_COLOR;
    for (let i in LOCKED_CELLS) {
        drawNode(LOCKED_CELLS[i])
    }
}

function drawClosedNodes() {
    contextCanvas.fillStyle = CLOSED_COLOR;
    for (let i in CLOSED_CELLS) {
        drawNode(CLOSED_CELLS[i])
    }
}

function drawPath() {
    contextCanvas.fillStyle = PATH_COLOR;
    for (let i in PATH) {
        drawNode(PATH[i])
    }
}

function drawAllCosts() {
    for (let r in WORK_GRID) {
        for (let c in WORK_GRID[r]) {
            drawNodeCosts(WORK_GRID[r][c])
        }
    }
}

function drawInitialNode() {
    contextCanvas.fillStyle = INITIAL_COLOR;
    drawNode(initialNode)
}

function drawGoalNode() {
    contextCanvas.fillStyle = GOAL_COLOR;
    drawNode(goalNode)
}

function drawCurrentNode() {
    contextCanvas.fillStyle = CURRENT_COLOR;
    drawNode(currentNode)
    drawNodeCosts(currentNode)
}

function drawNeighbourNodes() {
    contextCanvas.fillStyle = NEIGHBOURHOODS_COLOR;
    for (let i in NEIGHBOR) {
        drawNode(NEIGHBOR[i])
    }
}

function drawNode(node) {
    contextCanvas.fillRect(node.x, node.y, cell_width, cell_height)
}

function drawGrid() {
    contextCanvas.fillStyle = LINE_COLOR;

    for (let i = 0; i < maxHeight; i += cell_height) {
        contextCanvas.fillRect(0, i, maxWidth, 1)
    }

    for (let i = 0; i < maxWidth; i += cell_width) {
        contextCanvas.fillRect(i, 0, 1, maxHeight)
    }
}

function drawBackground() {
    contextCanvas.clearRect(0, 0, maxWidth, maxHeight)
    contextCanvas.fillStyle = BACKGROUND_COLOR;
    contextCanvas.fillRect(0, 0, maxWidth, maxHeight);
}

function drawNodeCosts(node) {
    drawText("T: " + node.t, node.x, node.y - 15)
    drawText("H: " + node.h + " G:" + node.g, node.x, node.y + 5)
}

function drawTextNode(txt, node) {
    contextCanvas.fillStyle = LINE_COLOR;
    contextCanvas.fillText(txt, node[0] + (cell_width / 2), node[1] + (cell_height / 2));
}

function drawText(txt, x, y) {
    contextCanvas.fillStyle = LINE_COLOR;
    contextCanvas.fillText(txt, x + (cell_width / 2), y + (cell_height / 2));
}

function end() {
    clearInterval(interval)
}