class Ray {
    constructor(sin, cos) {
        this.setAngle(sin, cos)
        this.touchedWalls = []
    }

    setAngle(sin, cos) {
        this.cosHandled = 100 * cos
        this.sinHandled = 100 * sin
    }

    update(x, y) {
        this.x = x
        this.y = y
        this.dirX = this.cosHandled * this.x
        this.dirY = this.sinHandled * this.y
        this.touchedWalls = []
        this.handleTouch()
    }

    handleTouch() {
        this.touch = false
        let selectedT = null
        for (let w of walls) {
            const t = this.intersect(w)
            if (t) {
                this.touch = true
                if (selectedT) {
                    if (this.distance(selectedT[0], selectedT[1]) >
                        this.distance(t[0], t[1])) {
                        selectedT = t
                    }
                } else
                    selectedT = t
            }
        }
        if (this.touch) {
            this.dirX = selectedT[0]
            this.dirY = selectedT[1]
            this.touchedWalls.push(this.distance(this.dirX, this.dirY))
        }
    }

    draw() {
        if (this.touch) {
            ctx.fillStyle = COLOR_TOUCH
            ctx.fillRect(this.dirX, this.dirY, fixedSize, fixedSize)
        }

        ctx.strokeStyle = COLOR_RAY
        ctx.beginPath();
        ctx.lineWidth = 1
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.dirX, this.dirY);
        ctx.closePath();
        ctx.stroke();
    }

    intersect(wall) {
        const x1 = wall.x;
        const y1 = wall.y;
        const x2 = wall.x + wall.width;
        const y2 = wall.y + wall.height;

        const x3 = this.x;
        const y3 = this.y;
        const x4 = this.x + this.dirX;
        const y4 = this.y + this.dirY;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
            return [
                x1 + t * (x2 - x1),
                y1 + t * (y2 - y1)
            ]
        } else {
            return;
        }
    }

    distance(x, y) {
        return Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        )
    }
}