class Enamy {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.rays = []
        this.limitDistance = 50
        this.sin = 0
        this.cos = 0
    }
    // double largura = 0;
    // double altura = 0;

    // largura = position.x - positionInitX;
    // if (largura < 0)
    //     largura *= -1;

    // altura = position.y - positionInitY;
    // if (altura < 0)
    //     altura *= -1;

    // double comprimento = Math.sqrt(Math.pow(altura, 2.0) + Math.pow(largura, 2.0));
    // if (comprimento != 0) {
    //     double seno = altura / comprimento;
    //     double cosseno = largura / comprimento;
    //     double mX = rectButtonInLeft ? -1 : rectButtonInRigth ? 1 : 0;
    //     double mY = rectButtonInTop ? -1 : rectButtonInBottom ? 1 : 0;
    //     player.moveX(cosseno, mX);
    //     player.moveY(seno, mY);
    // }
    update() {
        this.rays = []
        if (this.min > 360) return
        this.min += 5

        const comprimento = Math.sqrt(Math.pow(this.y, 2.0) + Math.pow(this.x, 2.0));
        this.sin = this.y / comprimento 
        this.cos = this.x / comprimento
        this.moveX(this.cos);
        this.moveY(this.sin);

        this.createRays()
    }

    moveX(cos) {
        this.x += this.calculateVelocity(cos, 1)
    }

    moveY(sin) {
        this.y += this.calculateVelocity(sin, 1)
    }

    calculateVelocity(angle, dir) {
        return 3 * angle * dir;
    }

    draw() {
        this.drawRays()
        ctx.fillStyle = COLOR_ENAMY
        let size = fixedSize * 2
        ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size)
    }

    drawRays() {
        for (let r of this.rays) {
            r.update(this.x, this.y)
            r.draw()
        }
    }

    createRays(min, max, each) {
        // for (let a = min; a < max; a += each) {
        //     this.rays.push(new Ray(this.radians(a)));
        // }
        console.log(this.sin, this.cos)
        this.rays.push(new Ray(this.radians(this.sin)));
    }

    radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
}