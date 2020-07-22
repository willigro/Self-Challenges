class Bird {
    constructor() {
        this.x = BASE_X_POSITION;
        this.y = BASE_Y_POSITION + (BASE_Y_POSITION / 2);
        this.width = 30
        this.height = BIRD_HEIGHT
        this.isAlive = true;
        this.color = this.random_rgba()

        this.score = 0

        this.isJumping = false;
        this.jumpForce = 10
        this.gravityForce = 5

        this.isDown = false

        this.brain = new Brain()
    }

    copy(dino, keep) {
        this.brain.copy(dino.brain, keep)
    }

    update() {
        if (!this.isAlive) return
        this.score += BASE_SPEED

        this.handleJump()
        this.gravity()

        if (this.y >= MAX_HEIGHT)
            this.die()
    }

    predict(nextObstacle) {
        if (!this.isAlive) return
        if (nextObstacle) {
            const outputs = this.brain.predict(
                [this.distance(nextObstacle), _game_speed])

            if (outputs[0] > 0) {
                this.turnToJump()
            }
        }
    }

    isColiding(object) {
        if (!object) return false
        object = object[0]

        // has horizontal gap
        if (this.x > object.x + object.width || object.x > this.x + this.width) return false;

        // has vertical gap
        if (this.y > object.y + object.height || object.y > this.y + this.height) return false;

        return true
    }

    die() {
        this.isAlive = false
    }

    turnToJump() {
        this.isJumping = true
    }

    gravity() {
        this.y += this.gravityForce
    }

    handleJump() {
        if (this.isJumping) {
            this.y -= this.jumpForce
            if (this.y < BASE_Y_POSITION) {
                this.y = BASE_Y_POSITION
            }
            this.isJumping = false
        }
    }

    distance(object) {
        if (object)
            return Math.sqrt(
                Math.pow(object.x - this.x, 2) + Math.pow(object.y - this.y, 2)
            )
        return 0
    }

    log() {
        // this.brain.log()
        // console.log("score", this.score)
        // console.log(this.x, this.y)
    }

    random_rgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
    }
}

class Pipe {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y;
        this.width = width
        this.height = height

        this.isShowing = true;
    }

    update() {
        if (!this.isShowing) return

        this.x -= _game_speed
    }

    outMap() {
        return !this.x || this.x + this.width < 0
    }

    getRight() {
        return this.x + this.width
    }
}