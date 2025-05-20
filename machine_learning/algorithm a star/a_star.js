const ROWS = 20
const COLS = 20
var WORK_GRID = []
var CLOSED_CELLS = []
var OPEN_CELLS = []
const LOCKED_CELLS = []
const PROXIMITY = 1

const GOAL_INDICE = [14, 14]
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
            if (Math.random() < 0.5) {
                LOCKED_CELLS.push(new Node(x, y, r, c))
            }
        }
        WORK_GRID.push(row)
    }

    initialNode = WORK_GRID[INIT_INDICE[0]][INIT_INDICE[1]]
    currentNode = WORK_GRID[INIT_INDICE[0]][INIT_INDICE[1]]
    goalNode = WORK_GRID[GOAL_INDICE[0]][GOAL_INDICE[1]]

    OPEN_CELLS.push(initialNode)

    handleLocked()
    // handleDistances()
}

function findPath() {
    if (OPEN_CELLS.length > 0) { // while
        var node = OPEN_CELLS[0]

        for (let i in OPEN_CELLS) {
            if (OPEN_CELLS[i].t <= node.t && OPEN_CELLS[i].h < node.h) {
                node = OPEN_CELLS[i]
            }
        }

        currentNode = node

        removeFrom(node, OPEN_CELLS)
        CLOSED_CELLS.push(node)

        if (isGoal(node)) {
            retracePath();
            OPEN_CELLS = []
            return // break
        }

        getNeighbours(node)
        for (let i in NEIGHBOR) {
            const newCostToNeighbour = node.g + distanceTo(node, NEIGHBOR[i]);
            if (newCostToNeighbour < NEIGHBOR[i].g || !contanis(NEIGHBOR[i], OPEN_CELLS)) {
                NEIGHBOR[i].g = newCostToNeighbour;
                NEIGHBOR[i].distances()
                NEIGHBOR[i].parent = node;

                if (!contanis(NEIGHBOR[i], OPEN_CELLS))
                    OPEN_CELLS.push(NEIGHBOR[i]);
            }
        }
    }
}

function getNeighbours(currentNode) {
    const currX = currentNode.position[0]
    const currY = currentNode.position[1]

    const initalX = (currX - PROXIMITY < 0) ? 0 : currX - PROXIMITY
    const finishX = (currX + PROXIMITY > COLS - PROXIMITY) ? COLS - PROXIMITY : currX + PROXIMITY

    const initalY = (currY - PROXIMITY < 0) ? 0 : currY - PROXIMITY
    const finishY = (currY + PROXIMITY > ROWS - PROXIMITY) ? ROWS - PROXIMITY : currY + PROXIMITY

    // console.log(initalX, finishX, initalY, finishY, currentNode)
    NEIGHBOR = []
    for (var r = initalY; r <= finishY; r++) {
        for (var c = initalX; c <= finishX; c++) {
            const node = WORK_GRID[c][r]
            if (isCurrent(node) || isLocked(node) || isClosed(node)) continue

            NEIGHBOR.push(node)
        }
    }
}

function retracePath() {
    var node = goalNode
    while (!sameNode(node, initialNode)) {
        PATH.push(node)
        node = node.parent;
    }
}

function removeFrom(node, list) {
    for (i in list) {
        if (sameNode(list[i], node)) {
            list.splice(i, 1)
            break
        }
    }
}

function contanis(node, list) {
    for (i in list) {
        if (sameNode(list[i], node)) {

            return true
        }
    }
    return false
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

function isGoal(node) {
    if (node) return sameNode(node, goalNode)
    return sameNode(currentNode, goalNode)
}

function isEnd(){
    return isGoal() || OPEN_CELLS.length == 0
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

function distanceToGoal(node) {
    return Math.floor(distance(node.x, node.y, goalNode.x, goalNode.y))
}

function distanceTo(n1, n2) {
    return Math.floor(distance(n1.x, n1.y, n2.x, n2.y))
}

function distance(x_from, y_from, x_to, y_to) {
    return Math.sqrt(
        Math.pow(x_to - x_from, 2) + Math.pow(y_to - y_from, 2)
    )
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
        this.h = 0
        this.g = 0
        this.t = 0
        this.parent = null
    }

    distances() {
        this.h = distanceToGoal(this)
        this.t = this.h + this.g
    }
}