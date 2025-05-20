class Segment {
    constructor(vec, angle, distance, radius) {
        this.vec = vec
        this.angle = angle
        this.radius = radius
        this.distanceToNext = distance

        // temp
        this.t_distance = 0
    }

    update(parent, previous) {
        this.angle = angle_to(this.vec, previous.vec);
        this.t_distance = distance_to(this.vec, previous.vec);

        if (this.t_distance > this.distanceToNext) {
            this.move(parent)
        }
    }

    move(parent) {
        this.vec.x += parent.speed * Math.cos(this.angle)
        this.vec.y += parent.speed * Math.sin(this.angle)
    }

    draw(parent) {
        drawCircle(this.vec.x, this.vec.y, this.radius, parent.color, parent.line)
        drawCircle(this.vec.x, this.vec.y, 1, BASE_COLOR, 1)

        let dirX = this.vec.x + Math.cos(this.angle) * this.distanceToNext;
        let dirY = this.vec.y + Math.sin(this.angle) * this.distanceToNext;

        drawLine(this.vec.x, this.vec.y, dirX, dirY, BASE_COLOR)
    }
}