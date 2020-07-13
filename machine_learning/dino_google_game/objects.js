const BASE_X_POSITION = 50
const BASE_Y_POSTITION = 400
const BASE_SPEED = 8
const DINO_HEIGHT = 30

var _game_speed = BASE_SPEED

class Dino {
    constructor() {
        this.x = BASE_X_POSITION;
        this.y = BASE_Y_POSTITION;
        this.width = 30
        this.height = DINO_HEIGHT
        this.isAlive = true;
        this.color = this.random_rgba()

        this.score = 0

        this.isJumping = false;
        this.jumpForce = 10
        this.gravityForce = 5
        this.limitHeightInJump = BASE_Y_POSTITION - 100

        this.isDown = false

        this.brain = new Brain()
    }

    copy(dino) {
        this.brain.copy(dino.brain)
    }

    update() {
        if (!this.isAlive) return
        this.score += BASE_SPEED

        if (this.isJumping)
            this.handleJump()

        this.gravity()
    }

    predict(nextTree, nextClound) {
        if (!this.isAlive) return
        if (nextTree) {
            const cloundY = (nextClound) ? nextClound.y : this.y
            const outputs = this.brain.predict([this.distance(nextTree)], [this.distance(nextClound)], this.y, cloundY)

            if (outputs[0] > 0) {
                this.jump()
            }

            if (outputs[1] > 0) {
                this.turnDown()
            } else {
                this.turnUp()
            }
        }
    }

    isColiding(object) {
        if (this.x >= object.x + object.width || object.x >= this.x + this.width) return false;

        if (this.y >= object.y + object.height || object.y >= this.y + this.height) return false;

        return true;
    }

    die() {
        this.isAlive = false
    }

    jump() {
        if (this.isGround) {
            this.isJumping = true
            this.turnUp()
            this.isGround = false
        }
    }

    turnUp() {
        if (!this.isGround) return

        if (this.isDown) {
            this.y = BASE_Y_POSTITION
            this.height = DINO_HEIGHT
            this.isDown = false
        }
    }

    turnDown() {
        if (!this.isGround) return

        if (!this.isDown) {
            this.height /= 2
            this.y += this.height
            this.isDown = true
        }
    }

    gravity() {
        if (this.y >= BASE_Y_POSTITION) {
            if (!this.isDown)
                this.y = BASE_Y_POSTITION
            this.isGround = true
            return
        }

        this.y += this.gravityForce
    }

    handleJump() {
        if (this.y <= this.limitHeightInJump) {
            this.isJumping = false
            return
        }

        this.y -= this.jumpForce
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

class Tree {
    constructor(x) {
        this.x = x
        this.y = BASE_Y_POSTITION;
        this.width = 30
        this.height = 30

        this.isShowing = true;
    }

    update() {
        if (!this.isShowing) return

        this.x -= _game_speed
    }

    outMap() {
        return this.x + this.width < 0
    }
}

class Clound {
    constructor(x) {
        this.x = x
        this.y = BASE_Y_POSTITION - 80;
        this.width = 30
        this.height = 90

        this.isShowing = true;
        console.log(this.x)
    }

    update() {
        if (!this.isShowing) return

        this.x -= _game_speed
    }

    outMap() {
        return this.x + this.width < 0
    }
}