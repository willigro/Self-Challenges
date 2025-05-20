
class W {
    constructor(vec) {
        this.vec = vec
        this.radius = (Math.random() * 35) + 5
        this.color = randomColor()
        this.max_speed = (Math.random() * 8) + 2
        this.min_speed = this.max_speed * .3
        this.speed = this.min_speed
        this.angle = Math.random() * 6
        this.surfaceAngle = 0
        this.tries = 0
        this.line = (Math.random() * 3) + 1
        this.colliding = false
        this.speedingUp = false
        this.segments = []

        this.buildSegments();
    }

    buildSegments() {
        this.segments.push(
            new Segment(
                this.vec,
                this.angle,
                0,
                this.radius
            )
        )

        let count = (Math.random() * 10) + 1

        for (let i = 0; i < count; i++) {
            /// getting previous
            let size = this.segments[i].radius
            let vec = newVector(this.segments[i].vec.x - size, this.segments[i].vec.y)
            this.segments.push(
                new Segment(
                    vec,
                    angle_to(vec, this.segments[i].vec),
                    size,
                    size * .8, // Reducing 20% for each segment
                )
            )
        }
    }

    update(all_w, delta) {
        // When the speed is modified, increase it slowly
        if (this.speedingUp) {
            this.speed = lerp(this.speed, this.max_speed, delta)

            if (this.speed >= this.max_speed) {
                this.speedingUp = false
            }
        } else {
            this.speed = lerp(this.speed, this.min_speed, delta)
        }

        this.bounceIfCollidingWithWall()

        for (let i = 0; i < all_w.length; i++) {
            if (this == all_w[i]) {
                continue
            }

            if (collision(this, all_w[i])) {
                // TODO: there are a few bugs
                // I think I can solve them by using the intersection point to calculate the angle

                _current_intersection = intersection(this, all_w[i]);
                if (_current_intersection) {
                    if (this.colliding == false) {
                        this.angle = angle_to(this.vec, all_w[i].vec) + degress_to_radians((Math.random() * 45) + 135)
                        this.color = randomColor()
                        this.colliding = true
                        // Some circles are not recognizing the collision because in the next ITERATION it is not colliding any more
                        // since it is verifying only the CURRENT one, and not the next, it will 'ignore' after the MOVE

                        // I don't like this solution, but it will make it require more FRAMES to stop the collision
                        // TODO: ensure that BOTH are detecting and acting
                        this.speedUp()

                        // Invertendo 
                        all_w[i].angle = angle_to(all_w[i].vec, this.vec) + degress_to_radians((Math.random() * 45) + 135)
                        all_w[i].color = randomColor()
                        all_w[i].speedUp()
                        all_w[i].move()
                    }
                    this.colliding = true
                }
            }
        }

        this.colliding = false
        this.move()
    }

    slowDown() {
        this.speedingUp = false
        //this.speed = this.max_speed * .2
    }

    speedUp() {
        //this.speed = this.max_speed
        this.speedingUp = true;
    }

    // it is duplicated, see Ia
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

            //this.slowDown()
            this.color = randomColor()
            this.angle = degress_to_radians(angleReflectDegree(radians_to_degrees(this.angle), this.surfaceAngle))
            this.move()
        }

    }

    move() {
        //this.vec.x += this.speed * Math.cos(this.angle)
        //this.vec.y += this.speed * Math.sin(this.angle)
        this.segments[0].angle = this.angle
        this.segments[0].move(this)
        for(let i = 1; i < this.segments.length; i++) {
            this.segments[i].update(this, this.segments[i - 1])
            //console.log(this.segments[i].vec)
        }
    }

    draw() {
        //drawCircle(this.vec.x, this.vec.y, this.radius, this.color, this.line)
        //drawCircle(this.vec.x, this.vec.y, 1, BASE_COLOR, 1)
        for(let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw(this)
        }
    }
}