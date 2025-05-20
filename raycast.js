class Ray {
    constructor(x, y, angle) {
        this.angle = angle
        this.radius = 100
        this.vec = newVector(x, y)
        this.dir = newVector(
           this.vec.x + Math.cos(angle) * this.radius,
           this.vec.y + Math.sin(angle) * this.radius,
        )
        this.touch = false
    }

    update(x, y) {
        this.vec.x = x
        this.vec.y = y
        this.dir.x = this.vec.x + Math.cos(this.angle) * this.radius
        this.dir.y = this.vec.y + Math.sin(this.angle) * this.radius
    }

    /**
     * touch is the touch in the interation
     * touching_current is the touch the current W
    */
    handleIntersection(w) {
        let touching_current = inteceptCircleLineSeg(w, this.vec, this.dir).length > 0
        
        if(this.touch == false) {
            this.touch = touching_current
        }
        
        return touching_current
    }

    draw() {
        if (this.touch) {
            ctx.fillStyle = "red"
            ctx.fillRect(this.dir.x, this.dir.y, 5, 5)

            drawLine(
                this.vec.x, this.vec.y,
                this.dir.x, this.dir.y,
                "white",
            );

            this.touch = false
        }
    }
}