class Brain {
    constructor() {
        this.inputLayer = []
        this.hiddenLayer = []
        this.outputLayer = []
        this.bias = 1
        this.chanceToChange = .4

        this.resultInput
        this.resultHidden
        this.resultOutput

        for (let i = 0; i < 6; i++) {
            this.inputLayer.push(this.random())
        }

        for (let i = 0; i < 5; i++) {
            this.hiddenLayer.push(this.random())
        }

        for (let i = 0; i < 2; i++) {
            this.outputLayer.push(this.random())
        }
    }

    log() {
        console.log("hidden", this.hiddenLayer)
        console.log("output", this.outputLayer)
    }

    copy(brain, keep) {
        this.inputLayer = brain.inputLayer.slice()
        for (let i in this.inputLayer) {
            if (!keep && Math.random() < this.chanceToChange) {
                this.inputLayer[i] = this.random()
            }
        }

        this.hiddenLayer = brain.hiddenLayer.slice()
        for (let i in this.hiddenLayer) {
            if (!keep && Math.random() < this.chanceToChange) {
                this.hiddenLayer[i] = this.random()
            }
        }

        this.outputLayer = brain.outputLayer.slice()
        for (let i in this.outputLayer) {
            if (!keep && Math.random() < this.chanceToChange) {
                this.outputLayer[i] = this.random()
            }
        }
    }

    predict(input) {
        this.resultInput = []
        for (let h in this.inputLayer) {
            let sum = 0
            for (let i in input) {
                sum += input[i] * this.inputLayer[h]
            }
            this.resultInput.push(this.activation(sum + this.bias))
        }

        this.resultHidden = []
        for (let h in this.hiddenLayer) {
            let sum = 0
            for (let i in this.resultInput) {
                sum += this.resultInput[i] * this.hiddenLayer[h]
            }
            this.resultHidden.push(this.activation(sum + this.bias))
        }
        // console.log("result", result)

        this.resultOutput = []
        for (let o in this.outputLayer) {
            let sum = 0
            for (let r in this.resultHidden) {
                sum += this.resultHidden[r] * this.outputLayer[o]
            }
            this.resultOutput.push(this.activation(sum + this.bias))
        }
        // console.log("outputs", this.resultOutput)
        return this.resultOutput
    }

    activation(x) {
        return ((x < 0) ? 0 : x);
        // return 1 / (1 + Math.exp(-x))
    }

    random() {
        const r = Math.random()
        return Math.random() > .5 ? r * -1 : r
    }
}

class Genetic {
    constructor() {
        this.best = null
    }

    envolve(dinos) {
        this.best = null
        for (let i in dinos) {
            if (this.best) {
                if (dinos[i].score > this.best.score)
                    this.best = dinos[i]
            } else {
                this.best = dinos[i]
            }
        }

        // this.best.log()

        const newDinos = []
        var dino = new Dino()
        dino.copy(this.best, true)
        newDinos.push(dino)

        for (let i = 0; i < DINO_POPULATION - 1; i++) {
            dino = new Dino()
            if (Math.random() > .1)
                dino.copy(this.best)
            newDinos.push(dino)
        }

        return newDinos
    }
}