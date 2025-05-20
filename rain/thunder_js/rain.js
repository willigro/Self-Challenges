var intervalChuva = 10
const AREA_MAX_DA_GOTA = 10
var maxArea = AREA_MAX_DA_GOTA
var sec = 0
var relampago = null

var gotas = [];

const SPEED_BASE = 3 // 2;

function prepareRain() {
    var maxGotas = maxWidth / 4
    gotas = []
    for (var coluna = 0; coluna < maxGotas; coluna++) {
        // that's need to be two times more than the value that will divide the maxWidth 4 -> 8 or 2 -> 4 or 0 (nothing or 1) -> 2, 8 -> 16
        // for test how less I use, better
        // with less gotas I can increase the SPEED_BASE
        gotas.push(new Gota((coluna * (maxArea / 20)) * 8))
    }
}

function rain() {
    modificarIntensidadeDaChuva()

    gotas.forEach(function(gota) { gota.draw() })
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
        return this.area * SPEED_BASE;
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