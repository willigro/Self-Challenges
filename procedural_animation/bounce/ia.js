class Ia {
    constructor(x, y) {
        this.vec = newVector(x, y)
        this.rays = []
        this.limitDistance = 50
        this.speed = 5
        this.angle = 0
        this.radius = 20
        this.color = randomColor()
        this.countCollisigon = 0
        this.velocity = newVector(1, 1)
    }

    update(w, delta) {
       //this.bounceIfCollidingWithWall()

        this.countCollisigon = 0
        for (let i = 0; i < this.rays.length; i++) {
            if (this.rays[i].handleIntersection(w)) {
                //this.angle += -angle_to(this.vec, w.vec) //+ degress_to_radians((Math.random() * 135) + 45)
                this.countCollisigon += 1
                this.velocity.x += this.vec.x - w.vec.x;
                this.velocity.y += this.vec.y - w.vec.y;
            }
        }

        const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

        // normalize
        this.velocity = newVector(
            this.velocity.x / magnitude,
            this.velocity.y / magnitude,
        )

        this.bounceIfCollidingWithWall()

        if (collision(this, w)) {
            this.color = randomColor()
        }
    }

    moveAfterUpdate(delta) {
        this.move()
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].update(this.vec.x, this.vec.y)
        }
    }

    move() {
        //this.vec.x += this.speed * this.velocity.x * Math.cos(this.angle)
        //this.vec.y += this.speed * this.velocity.y * Math.sin(this.angle)
        this.vec.x += this.speed * this.velocity.x
        this.vec.y += this.speed * this.velocity.y 
    }

    draw() {
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].draw()
        }

        drawCircle(this.vec.x, this.vec.y, this.radius, this.color, 3)
    }

    createRays(min, max, each) {
        for (let a = min; a < max; a += each) {
            this.rays.push(new Ray(this.vec.x, this.vec.y, degress_to_radians(a)));
        }
    }

    // it is duplicated, see W
    // Simplest way, and works fine
    bounceIfCollidingWithWall() {
        if (
            this.vec.x + this.radius > maxWidth ||
            this.vec.x - this.radius < 0 ||
            this.vec.y + this.radius > maxHeight ||
            this.vec.y - this.radius < 0
        ) {
            if (this.vec.x + this.radius > maxWidth) {
                this.vec.x = maxWidth - this.radius
                this.surfaceAngle = 90
            } else if (this.vec.x - this.radius < 0) {
                this.vec.x = this.radius
                this.surfaceAngle = 90
            }

            if (this.vec.y + this.radius > maxHeight) {
                this.vec.y = maxHeight - this.radius
                this.surfaceAngle = 180
            } else if (this.vec.y - this.radius < 0) {
                this.vec.y = this.radius
                this.surfaceAngle = 180
            }

            this.angle = degress_to_radians(angleReflectDegree(radians_to_degrees(this.angle), this.surfaceAngle))

            this.velocity = rotateVector(this.velocity, this.angle)
        }
    }
}