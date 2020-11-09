class Draw {
    constructor(context) {
        this.ctx = context
    }

    drawBackground(MAX_WIDTH, MAX_HEIGHT) {
        this.ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT)
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
    }

    drawDinos(dinos) {
        var dino
        for (let i in dinos) {
            dino = dinos[i];

            if (!dino.isAlive) continue

            this.ctx.fillStyle = dino.color
            this.ctx.fillRect(dino.x, dino.y, dino.width, dino.height)
        }
    }

    drawObstacles(obstacles) {
        var obst
        for (let i in obstacles) {
            obst = obstacles[i];

            if (!obst.isShowing) continue

            this.ctx.fillStyle = (obst.tag == TREE_TAG) ? "gray" : "black"
            this.ctx.fillRect(obst.x, obst.y, obst.width, obst.height)
        }
    }

    drawBestDinoInfo(bestDino, globalDino, next_obstacle, alives) {
        contextCanvas.font = "22px Arial"
        this.drawText("Era atual: " + actualEra + " de " + ERAS + " Dinos restantes: " + alives + " de " + DINO_POPULATION, BASE_X_POSITION, BASE_Y_POSITION_INFO)

        if (globalDino)
            this.drawText("Melhor de tudinho: " + globalDino.score, BASE_X_POSITION, BASE_Y_POSITION_INFO + 25)

        if (next_obstacle)
            this.drawText("Proximo obstaculo: " + next_obstacle[0].tag, BASE_X_POSITION, BASE_Y_POSITION_INFO + 75)

        this.drawText("Vel: " + _game_speed + " de " + MAX_SPEED, BASE_X_POSITION, BASE_Y_POSITION_INFO + 100)

        if (bestDino) {
            this.drawText("Bonzinho: " + bestDino.score, BASE_X_POSITION, BASE_Y_POSITION_INFO + 50)
            this.drawBrain(bestDino.brain)
        }
    }

    drawText(txt, x, y) {
        contextCanvas.fillStyle = "black";
        contextCanvas.fillText(txt, x, y);
    }

    /**
     * centralizar os blocos
    */
    drawBrain(brain) {
        contextCanvas.font = "14px Arial"
        var baseY = BASE_Y_POSITION_INFO
        var baseX = MAX_WIDTH / 2
        for (let i in brain.resultInput) {
            this.drawText(brain.resultInput[i], baseX + 20, baseY + 10)
            contextCanvas.fillStyle = (brain.resultInput[i] > 0) ? "red" : "black"
            this.ctx.fillRect(baseX, baseY, BRAIN_BLOCK_SIZE, BRAIN_BLOCK_SIZE)
            baseY += 15
        }

        baseY = BASE_Y_POSITION_INFO
        baseX += 160
        for (let i in brain.resultHidden) {
            this.drawText(brain.resultHidden[i], baseX + 20, baseY + 10)
            contextCanvas.fillStyle = (brain.resultHidden[i] > 0) ? "red" : "black"
            this.ctx.fillRect(baseX, baseY, BRAIN_BLOCK_SIZE, BRAIN_BLOCK_SIZE)
            baseY += 15
        }

        baseY = BASE_Y_POSITION_INFO
        baseX += 160
        for (let i in brain.resultOutput) {
            this.drawText((i == 0) ? "Pular" : "Abaixar", baseX + 20, baseY + 10)
            contextCanvas.fillStyle = (brain.resultOutput[i] > 0) ? "red" : "black"
            this.ctx.fillRect(baseX, baseY, BRAIN_BLOCK_SIZE, BRAIN_BLOCK_SIZE)
            baseY += 15
        }
    }
}