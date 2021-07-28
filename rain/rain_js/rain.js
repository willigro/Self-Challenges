var contextCanvas;
var maxWidth = window.innerWidth;
var maxHeight = window.innerHeight
var intervalChuva = 10
const AREA_MAX_DA_GOTA = 10
var maxArea = AREA_MAX_DA_GOTA
var sec = 0
var relampago = null

window.onload = function() {
    var canvas = document.querySelector("canvas");
    canvas.width = maxWidth
    canvas.height = maxHeight
    contextCanvas = canvas.getContext("2d")
    chover();
    //setInterval(function () { draw(); }, 500)
}

function chover() {
    var maxGotas = maxWidth * 2
    var gotas = []
    for (var coluna = 0; coluna < maxGotas; coluna++) {
        gotas.push(new Gota((coluna * (maxArea / 20)) - 5))
    }
    setInterval(function() {
        contextCanvas.clearRect(0, 0, maxWidth, maxHeight)
        modificarIntensidadeDaChuva()
            //relampear()
        gotas.forEach(function(gota) { gota.draw() })
    }, intervalChuva);
}

function modificarIntensidadeDaChuva() {
    sec += intervalChuva
    if (sec > 22000) {
        if (maxArea < AREA_MAX_DA_GOTA)
            maxArea += 0.005
    } else if (sec > 19000) {
        maxArea -= 0.005
    }
}

function relampear() {
    if (relampago != null) {
        relampago.draw()
        if (relampago.isEnd())
            relampago = null
    } else {
        if (random(200) == 200) {
            relampago = new Relampago(random(100), random(maxHeight * 0.2))
        }
    }
}

function random(max) {
    return Math.floor(Math.random() * max + 1)
}

function randomMin(max, min) {
    return Math.floor(Math.random() * max + min)
}

class Relampago {
    constructor(x, y) {
        contextCanvas.beginPath()
        contextCanvas.moveTo(x, y);
        this.x = x
        this.y = y
    }

    draw() {
        this.y++;
        this.x++;
        contextCanvas.strokeStyle = "red";
        contextCanvas.lineTo(this.x, this.y);
        contextCanvas.stroke();
        //contextCanvas.fillRect(0,0,this.x,this.y)
    }

    isEnd() {
        return this.x > 100;
    }
}

class Gota {
    constructor(x) {
        this.x = x
        this.iniciar()
    }

    iniciar() {
        this.area = randomMin(maxArea, maxArea / 2)
        this.areaY = this.area
        this.areaX = Math.random() * 2
        this.speed = this.getSpeed()
        this.y = random(-300)
        this.espalhandoCima = false
        this.espalhandoBaixo = false
        this.ladoSelecionado = 0
        this.xPos = this.x
    }

    draw() {
        if (this.tocandoChao() || this.espalhandoCima || this.espalhandoBaixo) {
            this.espalharGota()
        } else {
            this.esticarGota()
            this.y += this.speed
            this.xPos += 0.5
        }
        //contextCanvas.fillStyle = "rgb(160, 191, 219, 0.5)"
        contextCanvas.fillStyle = "rgb(255, 255, 255, 0.5)"
        contextCanvas.fillRect(this.xPos, this.y, this.areaX, this.areaY)
    }

    tocandoChao() {
        return this.y > maxHeight
    }

    esticarGota() {
        if (this.areaY < this.area * 4) {
            this.areaY += this.areaY * 0.1
            this.speed += this.speed * 0.01
        }
    }

    getSpeed() {
        return this.area * 2
    }

    espalharGota() {
        if (this.espalhandoBaixo && this.tocandoChao()) {
            this.iniciar()
        } else {
            if (this.alturaDeReflexaoMaxima()) {
                this.espalhandoBaixo = true
            } else if (!this.espalhandoBaixo) {
                this.espalhandoCima = true
                this.espalharParaOsLados()
            }

            if (this.espalhandoBaixo) {
                this.y += this.speed / 3
            } else if (this.espalhandoCima) {
                this.y -= this.speed / 3
                this.areaY -= this.speed * 0.2
            }
        }
    }

    alturaDeReflexaoMaxima() {
        return this.y < maxHeight - (this.area * 3)
    }

    espalharParaOsLados() {
        if (this.ladoSelecionado == 0) {
            if (random(2) == 2)
                this.ladoSelecionado = 1
            else
                this.ladoSelecionado = -1
        }
        this.xPos += this.ladoSelecionado * 2
    }
}