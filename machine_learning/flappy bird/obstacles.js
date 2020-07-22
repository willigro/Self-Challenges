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
            const t = this.obstacles[i]
            if (t.outMap()) {
                obstacles.splice(i, 1)
                i--
                removed = true
            }
        }

        if (this.obstacles.length == 0 || removed && this.obstacles.length < 4) {
            var last = (this.obstacles.length > 0) ? this.obstacles[this.obstacles.length - 1] : null

            var distance = (last && last.x >= MAX_WIDTH) ? last.getRight() : MAX_WIDTH
            distance += this.getDistanceObstacle()

            this.obstacles.push(new Pipe(distance, BASE_Y_POSITION, OBJECT_WIDTH, 100))
            this.obstacles.push(new Pipe(distance, BASE_Y_POSITION + 200, OBJECT_WIDTH, MAX_HEIGHT - BASE_Y_POSITION))
        }
    }

    update(score_to_speed) {
        for (let i in this.obstacles) {
            this.obstacles[i].update(score_to_speed)
        }
    }

    getNextFromObstacles(bird) {
        var next = null
        if (bird) {
            var obstacle
            for (let i in this.obstacles) {
                obstacle = this.obstacles[i]
                if (obstacle.x > bird.x) {
                    const d = bird.distance(obstacle)
                    if (next == null || next[1] > d)
                        next = [obstacle, d]
                }
            }
        }
        return next
    }

    getDistanceObstacle() {
        return DISTANCE_BETWEEN_PIPE
    }
}