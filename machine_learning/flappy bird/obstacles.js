class Obstacle {
    constructor() {
        this.init()
    }

    init() {
        this.obstacles = []
    }

    generateObstacles() {
        var removed = false
        for (let i = 0; i < this.obstacles.length; i++) {
            const t = this.obstacles[i][0]
            if (t.outMap()) {
                this.obstacles.splice(i, 1)
                i--
                removed = true
            }
        }

        if (this.obstacles.length == 0 || this.safeDistance()) {
            const h_1 = MIN_HEIGHT_PIPE + (HEIGHT_ALLOWED * Math.random())
            const y_2 = h_1 + DISTANCE_BETWEEN_PIPE

            this.obstacles.push([
                new Pipe(MAX_WIDTH, BASE_Y_POSITION, OBJECT_WIDTH, h_1),
                new Pipe(MAX_WIDTH, BASE_Y_POSITION + y_2, OBJECT_WIDTH, MAX_HEIGHT - BASE_Y_POSITION)
            ])
        }
    }

    safeDistance() {
        return MAX_WIDTH - this.obstacles[this.obstacles.length - 1][0].x > DISTANCE_TO_NEXT_PIPE
    }

    update(score_to_speed) {
        for (let i in this.obstacles) {
            this.obstacles[i][0].update(score_to_speed)
            this.obstacles[i][1].update(score_to_speed)
        }
    }

    getNextFromObstacles(bird) {
        var next = null
        if (bird) {
            var obstacle
            for (let i in this.obstacles) {
                obstacle = this.obstacles[i]
                if (obstacle[0].x > bird.x) {
                    const d = bird.distance(obstacle[0])
                    if (next == null || next[1] > d)
                        next = [obstacle, d]
                }
            }
        }
        if (next)
            return next[0]
        return null
    }

    getDistanceObstacle() {
        return DISTANCE_BETWEEN_PIPE
    }

    spaceBetween(obs){
        const oTop = obs[0]

        return new Pipe(oTop.x, oTop.y + oTop.height, oTop.width, this.getDistanceObstacle())
    }
}