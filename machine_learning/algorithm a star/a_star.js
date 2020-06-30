const ROWS = 8
const COLS = 8
var WORK_GRID = []
var CLOSED_CELLS = []
const LOCKED_CELLS = []

const GOAL_INDICE = [5, 5]
const INIT_INDICE = [0, 0]
var NEIGHBOR = []
var PATH = []

var initialNode
var goalNode
var bestNode

var currentNode
var nextNode

function startGrid(cell_width, cell_height) {

    for (var r = 0; r < ROWS; r++) {
        const row = []
        for (var c = 0; c < COLS; c++) {
            const x = r * cell_width
            const y = c * cell_height

            // referencias diferentes
            row.push(new Node(x, y, r, c))
            if (Math.random() < 0.1) {
                LOCKED_CELLS.push(new Node(x, y, r, c))
            }
        }
        WORK_GRID.push(row)
    }

    initialNode = WORK_GRID[INIT_INDICE[0]][INIT_INDICE[1]]
    currentNode = WORK_GRID[INIT_INDICE[0]][INIT_INDICE[1]]
    goalNode = WORK_GRID[GOAL_INDICE[0]][GOAL_INDICE[1]]

    handleLocked()
    handleDistances()
}

var proximity = 1
var up = false

function detectNeighbour() {
    PATH.push(currentNode)
    CLOSED_CELLS.push(currentNode)
    if (nextNode) currentNode = nextNode

    // if (up) proximity += 1
    // else proximity = 1

    const currX = currentNode.position[0]
    const currY = currentNode.position[1]

    const initalX = (currX - proximity < 0) ? 0 : currX - proximity
    const finishX = (currX + proximity > COLS - proximity) ? COLS - proximity : currX + proximity

    const initalY = (currY - proximity < 0) ? 0 : currY - proximity
    const finishY = (currY + proximity > ROWS - proximity) ? ROWS - proximity : currY + proximity

    console.log(initalX, finishX, initalY, finishY, currentNode)
    NEIGHBOR = []
    bestNode = null

    for (var r = initalY; r <= finishY; r++) {
        for (var c = initalX; c <= finishX; c++) {
            const node = WORK_GRID[c][r]
            if (isCurrent(node) || isLocked(node) || isClosed(node)) continue

            // if (!node) continue

            if (bestNode) {
                if (bestNode.t > node.t) { // || bestNode[1] > g || bestNode[2] > s
                    bestNode = node
                }
            } else {
                bestNode = node
            }

            NEIGHBOR.push(node)
        }
    }

    // WORK_GRID[currentNode[0]][currentNode[1]] = null
    nextNode = bestNode
    // if (bestNode) {
    //     nextNode = [bestNode[3], bestNode[4]]
    //     CLOSED_CELLS.push(nextNode)
    //     up = false
    // } else {
    //     nextNode = null
    //     up = true
    // }
}

function handleLocked() {
    var r = 0
    for (var i in LOCKED_CELLS) {
        const n = LOCKED_CELLS[i]
        if (sameNode(n, initialNode) || sameNode(n, goalNode)) {
            r += 1
            LOCKED_CELLS.splice(i, 1)
            if (r == 2) break
        }
    }
}

function sameNode(n1, n2) {
    return n1.x == n2.x && n1.y == n2.y
}

function sameNodeByPosition(n1, n2) {
    return n1.position[0] == n2.position[0] && n1.position[1] == n2.position[1]
}

function isGoal() {
    return sameNode(currentNode, goalNode)
}

function isLocked(node) {
    for (let i in LOCKED_CELLS) {
        if (sameNodeByPosition(LOCKED_CELLS[i], node)) return true
    }
    return false
}

function isCurrent(node) {
    return sameNode(node, currentNode)
}

function isClosed(node) {
    for (let i in CLOSED_CELLS) {
        if (sameNodeByPosition(CLOSED_CELLS[i], node)) return true
    }
    return false
}

function handleDistances() {
    for (let r in WORK_GRID)
        for (let c in WORK_GRID[r])
            WORK_GRID[r][c].distances()
}

class Node {
    constructor(x, y, row, col) {
        this.x = x
        this.y = y
        this.position = [row, col]
    }

    distances() {
        this.h = this.distanceToGoal()
        this.g = this.distanceToInitial()
        this.t = this.h + this.g
    }

    distanceToGoal() {
        return Math.floor(this.distance(this.x, this.y, goalNode.x, goalNode.y))
    }

    distanceToInitial() {
        return Math.floor(this.distance(this.x, this.y, initialNode.x, initialNode.y))
    }

    distance(x_from, y_from, x_to, y_to) {
        return Math.sqrt(
            Math.pow(x_to - x_from, 2) + Math.pow(y_to - y_from, 2)
        )
    }
}