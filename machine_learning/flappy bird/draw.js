class Draw {
    constructor(context) {
        this.ctx = context
    }

    drawBackground(MAX_WIDTH, MAX_HEIGHT) {
        this.ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT)
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
    }

    drawBirds(birds) {
        var bird
        for (let i in birds) {
            bird = birds[i];

            if (!bird.isAlive) continue

            this.ctx.fillStyle = bird.color
            this.ctx.fillRect(bird.x, bird.y, bird.width, bird.height)
        }
    }

    drawObstacles(obstacles) {
        var obst
        for (let i in obstacles) {
            obst = obstacles[i];

            if (!obst.isShowing) continue

            this.ctx.fillStyle = "black"
            this.ctx.fillRect(obst.x, obst.y, obst.width, obst.height)
        }
    }

    drawBestDinoInfo(best, global_best, next_obstacle, alives) {
        contextCanvas.font = "22px Arial"
        this.drawText("Era atual: " + actualEra + " Restantes: " + alives, BASE_X_POSITION_INFO, BASE_Y_POSITION_INFO)

        if (global_best)
            this.drawText("Melhor de tudinho: " + global_best.score, BASE_X_POSITION_INFO, BASE_Y_POSITION_INFO + 25)

        if (next_obstacle)
            this.drawText("Proximo obstaculo: " + next_obstacle[0].tag, BASE_X_POSITION_INFO, BASE_Y_POSITION_INFO + 75)

        this.drawText("Vel: " + _game_speed, BASE_X_POSITION_INFO, BASE_Y_POSITION_INFO + 100)

        if (best) {
            this.drawText("Bonzinho: " + best.score, BASE_X_POSITION_INFO, BASE_Y_POSITION_INFO + 50)
            this.drawBrain(best.brain)
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
        var baseX = BASE_X_POSITION_BRAIN
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