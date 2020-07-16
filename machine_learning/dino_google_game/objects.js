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

    copy(dino, keep) {
        this.brain.copy(dino.brain, keep)
    }

    update() {
        if (!this.isAlive) return
        this.score += BASE_SPEED

        if (this.isJumping)
            this.handleJump()

        this.gravity()
    }

    predict(nextObstacle) {
        if (!this.isAlive) return
        if (nextObstacle) {
            const outputs = this.brain.predict(
                [this.distance(nextObstacle),
                nextObstacle.width,
                nextObstacle.height,
                    _game_speed])

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
    constructor(x, width) {
        this.x = x
        this.y = BASE_Y_POSTITION;
        this.width = width
        this.height = 30

        this.isShowing = true;
        this.tag = TREE_TAG
    }

    update() {
        if (!this.isShowing) return

        this.x -= _game_speed
    }

    outMap() {
        return !this.x || this.x + this.width < 0
    }

    getRight(){
        return this.x + this.width
    }
}

class Clound {
    constructor(x) {
        this.x = x
        this.y = BASE_Y_POSTITION - 80;
        this.width = 30
        this.height = 90

        this.isShowing = true;
        this.tag = CLOUND_TAG
    }

    update() {
        if (!this.isShowing) return

        this.x -= _game_speed
    }

    outMap() {
        return !this.x || this.x + this.width < 0
    }
    
    getRight(){
        return this.x + this.width
    }
}