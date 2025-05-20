class Bird {
    constructor() {
        this.x = BASE_X_POSITION;
        this.y = BASE_Y_POSITION + (BASE_Y_POSITION / 2);
        this.width = 30
        this.height = BIRD_HEIGHT
        this.isAlive = true;
        this.color = this.random_rgba()

        this.score = 0

        this.turnsJumping = 0
        this.isJumping = false;
        this.jumpForce = 8
        this.gravityForce = 6

        this.isDown = false

        this.brain = new Brain()
    }

    copy(dino, keep) {
        this.brain.copy(dino.brain, keep)
    }

    update() {
        if (!this.isAlive) return
        this.score += BASE_SPEED


        if (this.isJumping)
            this.handleJump()
        else
            this.gravity()

        if (this.y >= MAX_HEIGHT)
            this.die()
    }

    predict(betweenSpace) {
        if (!this.isAlive) return
        if (betweenSpace) {
            const outputs = this.brain.predict([
                betweenSpace.y - this.y
                , betweenSpace.x - this.x
                // , this.y
                // , this.isJumping ? this.jumpForce : -this.gravityForce
                // , betweenSpace.middleY()
                // , this.distanceToMiddle(betweenSpace)
            ])

            if (outputs[0] == 0) {
                this.turnToJump()
            }
        }
    }

    isColiding(objects) {
        if (!objects) return false
        for (let i in objects) {
            const object = objects[i]

            // has horizontal gap
            if (this.x > object.x + object.width || object.x > this.x + this.width) continue;

            // has vertical gap
            if (this.y > object.y + object.height || object.y > this.y + this.height) continue;

            return true
        }
        return false;
    }

    die() {
        this.isAlive = false
    }

    turnToJump() {
        this.isJumping = true
        this.turnsJumping = 0
    }

    gravity() {
        this.y += this.gravityForce
    }

    handleJump() {
        this.y -= this.jumpForce
        if (this.y < BASE_Y_POSITION) {
            this.y = BASE_Y_POSITION
            // this.die()
        }

        if (this.turnsJumping == 8) {
            this.isJumping = false
            this.turnsJumping = 0
        }
        this.turnsJumping++
    }

    distance(object) {
        if (object)
            return Math.sqrt(
                Math.pow(object.x - this.x, 2) + Math.pow(object.y - this.y, 2)
            )
        return 0
    }

    distanceToMiddle(object) {
        if (object)
            return Math.sqrt(
                Math.pow(object.x - this.x, 2) + Math.pow(object.middleY() - this.y, 2)
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

    middleX() {
        return this.x + (this.width / 2)
    }

    middleY() {
        return this.y + (this.height / 2)
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