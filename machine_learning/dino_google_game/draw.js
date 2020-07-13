class Draw {
    constructor(context) {
        this.ctx = context
    }

    drawBackground(maxWidth, maxHeight) {
        this.ctx.clearRect(0, 0, maxWidth, maxHeight)
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, maxWidth, maxHeight);
    }

    drawDinos(dinos) {
        var dino
        for (let i in dinos) {
            dino = dinos[i];

            if (!dino.isAlive) continue

            this.ctx.fillStyle = dino.color
            this.ctx.fillRect(dino.x, dino.y, dino.width, dino.height)
        }
    }

    drawTrees(trees) {
        var tree
        for (let i in trees) {
            tree = trees[i];

            if (!tree.isShowing) continue

            this.ctx.fillStyle = "gray"
            this.ctx.fillRect(tree.x, tree.y, tree.width, tree.height)
        }
    }

    drawClounds(clounds) {
        var clound
        for (let i in clounds) {
            clound = clounds[i];

            if (!clound.isShowing) continue

            this.ctx.fillStyle = "white"
            this.ctx.fillRect(clound.x, clound.y, clound.width, clound.height)
        }
    }

    
}