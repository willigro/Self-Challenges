var contextCanvas
var delay = 1000 / 30
var maxWidth = window.innerWidth
var maxHeight = window.innerHeight
const fixedSize = 4

var distanceToCenter = 100
var thunders = []
var centerPointX = 0
var centerPointY = 0

THUNDER_VELOCITY = 15;
THUNDER_COLOR = "white";
THUNDER_VERTICE_MIN_SIZE = 10;
THUNDER_VERTICE_MAX_SIZE = 60;
THUNDER_VERTICE_ARMS_MAX_SIZE = 15;
THUNDER_VERTICE_ARMS_MIN_SIZE = 5;
MAX_THUNDER_LENGTH = 30;
MAX_THUNDER_ARM_LENGTH = 8;
THUNDER_MAX_THICK = 3;
THUNDER_ARM_MAX_THICK = 2;

var blinkScreen = false;
var blinkScreenAlpha = 1.0;

window.onload = function() {
    var canvas = document.getElementById("canvas");
    canvas.width = maxWidth
    canvas.height = maxHeight
    centerPointX = (maxWidth / 2) - (fixedSize / 2)
    centerPointY = (maxHeight / 2) - (fixedSize / 2)
    contextCanvas = canvas.getContext("2d");
    init()
}

function init() {
    prepareRain();

    prepareThunder();

    render()
}

function prepareThunder() {
    var thunderInterval = setInterval(function() {

        var l = random(4);
        for (let i = 0; i < l; i++) {
            let t = null;
            if (i == l - 1) {
                t = new Thunder(random(maxWidth), 0, function() {
                    thunders = [];

                    prepareThunder();
                });
            } else {
                t = new Thunder(random(maxWidth), 0);
            }

            thunders.push(t);
        }

        clearInterval(thunderInterval)
    }, randomMin(8000, 2000));
}

function render() {
    drawBackground();

    for (t of thunders) {
        t.updateAndDraw();
    }

    rain();

    // comment when in test
    requestAnimationFrame(render)
}

function doBlink() {
    blinkScreen = true;
    blinkScreenAlpha -= .1;
}

function resetThunders() {
    blinkScreenAlpha = 1.0;
}

function drawBackground() {
    contextCanvas.clearRect(0, 0, maxWidth, maxHeight)

    if (!blinkScreen) {
        contextCanvas.fillStyle = "black";
        contextCanvas.fillRect(0, 0, maxWidth, maxHeight);
    } else {
        contextCanvas.fillStyle = "rgb(255, 255, 255, " + blinkScreenAlpha + ")";
        contextCanvas.fillRect(0, 0, maxWidth, maxHeight);
        blinkScreen = false
    }
}

function random(max) {
    return Math.floor(Math.random() * max + 1)
}

function randomMin(max, min) {
    return Math.floor(Math.random() * max + min)
}

// var currentThunder = null;

class Thunder {
    constructor(x, y, doOnEnd) {
        this.x = x;
        this.y = y;

        this.mainVerticeThick = randomMin(THUNDER_MAX_THICK, 1);

        this.vertices = [];

        this.addNextVertice();

        this.doOnEnd = doOnEnd;

        this.ticks = 0;
        this.thunderInterval = null;

        this.maxTicks = randomMin(20, 5);
    }

    finalizeThunder(currentThunder) {
        if (currentThunder) {
            doBlink();

            currentThunder.ticks = 0;
            currentThunder.thunderInterval = setInterval(function() {
                if (currentThunder) {
                    if (currentThunder.ticks <= this.maxTicks / 3) {
                        for (let v in currentThunder.vertices) {
                            currentThunder.vertices[v].increaseThick();
                        }
                    } else {
                        if (currentThunder.ticks == currentThunder.maxTicks) {
                            clearInterval(currentThunder.thunderInterval)
                            if (currentThunder.doOnEnd)
                                currentThunder.doOnEnd();
                            currentThunder = null;

                            resetThunders();
                        } else {
                            for (let v in currentThunder.vertices) {
                                currentThunder.vertices[v].decreaseThick(currentThunder.maxTicks);
                            }
                        }
                    }

                    if (currentThunder)
                        currentThunder.ticks += 1;
                }
            }, 100);
        }
    }

    addNextVertice() {
        let x = this.x;
        let y = this.y;

        const dir = (random(2) == 1) ? 1 : -1;

        let nextX = x + (randomMin(THUNDER_VERTICE_MAX_SIZE, THUNDER_VERTICE_MIN_SIZE) * dir);
        let nextY = y + randomMin(THUNDER_VERTICE_MAX_SIZE, THUNDER_VERTICE_MIN_SIZE);

        if (this.vertices.length > 0) {
            const current = this.vertices[this.vertices.length - 1];

            x = current.currentX;
            y = current.currentY;

            nextX = x + (randomMin(THUNDER_VERTICE_MAX_SIZE, THUNDER_VERTICE_MIN_SIZE) * dir);
            nextY = y + randomMin(THUNDER_VERTICE_MAX_SIZE, THUNDER_VERTICE_MIN_SIZE);
        }

        const nextVertice = new NextVertice(this, x, y, nextX, nextY, this.mainVerticeThick, true, function(thunder) {
            if (thunder.vertices.length % 6 == 0) {
                doBlink();
            }

            if (thunder.vertices.length < MAX_THUNDER_LENGTH && nextX > 0 && nextX < maxWidth && nextY > 0 && nextY < maxHeight)
                thunder.addNextVertice();
            else
                thunder.finalizeThunder(thunder);
        })

        if (nextX > 0 && nextY > 0)
            this.vertices.push(nextVertice);
        else
            this.finalizeThunder(this);


        /*
        Controll the thunder intensity to show the all screen in a grey (white) scale
        when the line is stroger the blink will be whiter and the line thicker
        */
    }

    updateAndDraw() {
        for (let vertice in this.vertices) {
            this.vertices[vertice].updateAndDraw();
        }
    }
}

class NextVertice {
    constructor(thunder, currentX, currentY, finalX, finalY, thick, isMain, toNext, isSecond) {
        this.alpha = 1.0;

        this.thunder = thunder;

        this.isMain = isMain;
        this.isSecond = isSecond;

        this.thick = thick;
        if (!this.isMain) this.thick /= 2;

        this.initialX = currentX;
        this.initialY = currentY;

        this.currentX = currentX;
        this.currentY = currentY;

        this.finalX = finalX;
        this.finalY = finalY;

        this.stop = false;

        this.toNexT = toNext;

        this.smallArms = [];

        if ((this.isMain || this.isSecond) && random(5) == 2) {
            const armsLen = randomMin(MAX_THUNDER_ARM_LENGTH, MAX_THUNDER_ARM_LENGTH / 2);

            const dir = (random(2) == 1) ? 1 : -1;
            const dirY = (random(2) == 1) ? 1 : -1;

            let x = this.currentX;
            let y = this.currentY;

            let nextX = x + randomMin(THUNDER_VERTICE_ARMS_MAX_SIZE, THUNDER_VERTICE_ARMS_MIN_SIZE) * dir;
            let nextY = y + randomMin(THUNDER_VERTICE_ARMS_MAX_SIZE, THUNDER_VERTICE_ARMS_MIN_SIZE) * dirY;

            for (let i = 0; i < armsLen; i++) {
                this.smallArms.push(new NextVertice(null, x, y, nextX, nextY, THUNDER_ARM_MAX_THICK, false, null, this.isMain))

                x = nextX;
                y = nextY;

                nextX += randomMin(THUNDER_VERTICE_ARMS_MAX_SIZE, THUNDER_VERTICE_ARMS_MIN_SIZE) * dir;
                nextY += randomMin(THUNDER_VERTICE_ARMS_MAX_SIZE, THUNDER_VERTICE_ARMS_MIN_SIZE) * dirY;
            }
        }
    }

    updateAndDraw() {
        this.update();
        this.draw();

        for (let a in this.smallArms) {
            this.smallArms[a].updateAndDraw();
        }
    }

    update() {
        if (this.stop) return;

        const distance = this.distance(this.finalX, this.finalY);

        const sin = this.currentX / distance;
        const cos = this.currentY / distance;

        this.currentX += this.calculateVelocity(cos);
        this.currentY += this.calculateVelocity(sin);

        if (this.currentX > this.finalX) this.currentX = this.finalX;
        if (this.currentY > this.finalY) this.currentY = this.finalY;

        if (this.currentX == this.finalX && this.currentY == this.finalY) {
            this.stop = true;

            if (this.toNexT)
                this.toNexT(this.thunder);
        }
    }

    increaseThick() {
        this.thick += .5;
    }

    decreaseThick(maxTicks) {
        this.alpha -= maxTicks / 100;

        for (let a in this.smallArms) {
            this.smallArms[a].decreaseThick(maxTicks);
        }
    }

    calculateVelocity(angle) {
        return THUNDER_VELOCITY * angle;
    }

    draw() {
        contextCanvas.beginPath();
        contextCanvas.shadowBlur = this.thick * 10;
        contextCanvas.shadowColor = "rgb(255, 255, 255, " + this.alpha + ")"
        contextCanvas.strokeStyle = "rgb(255, 255, 255, " + this.alpha + ")"
        contextCanvas.moveTo(this.initialX, this.initialY);
        contextCanvas.lineTo(this.currentX, this.currentY);
        contextCanvas.lineWidth = this.thick;
        contextCanvas.stroke();
    }

    distance(x, y) {
        return Math.sqrt(
            Math.pow(x - this.initialX, 2) + Math.pow(y - this.initialY, 2)
        )
    }
}