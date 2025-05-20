class Brain {
    constructor() {
        this.inputLayer = []
        this.hiddenLayer = []
        this.hiddenLayer2 = []
        this.outputLayer = []
        this.bias = []
        this.chanceToChange = .3

        this.resultInput
        this.resultHidden
        this.resultHidden2
        this.resultOutput

        this.learningRate = 0.03

        for (let i = 0; i < 3; i++) {
            this.bias.push(this.newBias())
        }

        for (let i = 0; i < 2; i++) {
            this.inputLayer.push(this.random())
        }

        for (let i = 0; i < 3; i++) {
            this.hiddenLayer.push(this.random())
        }

        for (let i = 0; i < 1; i++) {
            this.outputLayer.push(this.random())
        }
    }

    newBias() {
        return Math.random() > .5 ? 1 : 0
        // return 1
    }

    log() {
        console.log("inputLayer", this.inputLayer)
        console.log("hiddenLayer", this.hiddenLayer)
        console.log("outputLayer", this.outputLayer)
    }

    copy(brain, keep) {
        if (!keep) {
            for (let i in this.bias) {
                this.bias[i] = this.newBias()
            }
        }
        this.inputLayer = brain.inputLayer.slice()
        this.hiddenLayer = brain.hiddenLayer.slice()
        this.outputLayer = brain.outputLayer.slice()

        if (keep) return

        for (let i in this.inputLayer) {
            this.inputLayer[i] = this.newWeight(this.inputLayer[i])
        }

        for (let i in this.hiddenLayer) {
            this.hiddenLayer[i] = this.newWeight(this.hiddenLayer[i])
        }

        for (let i in this.outputLayer) {
            this.outputLayer[i] = this.newWeight(this.outputLayer[i])
        }
    }

    predict(input) {
        // console.log(input)
        this.resultInput = []
        for (let h in this.inputLayer) {
            let sum = 0
            for (let i in input) {
                sum += input[i] * this.inputLayer[h]
            }
            this.resultInput.push(this.activation(sum + this.bias[0]))
        }

        this.resultHidden = []
        for (let h in this.hiddenLayer) {
            let sum = 0
            for (let i in this.resultInput) {
                sum += this.resultInput[i] * this.hiddenLayer[h]
            }
            this.resultHidden.push(this.activation(sum + this.bias[1]))
        }

        this.resultOutput = []
        for (let o in this.outputLayer) {
            let sum = 0
            for (let r in this.resultHidden) {
                sum += this.resultHidden[r] * this.outputLayer[o]
            }
            this.resultOutput.push(this.activation(sum + this.bias[2]))
        }

        return this.resultOutput
    }

    activation(x) {
        // return x
        return ((x < 0) ? 0 : x);
        // return 1 / (1 + Math.exp(-x))
    }

    newWeight(x) {
        // return Math.random() > .5 ? x - this.learningRate : x + this.learningRate
        // return x - this.learningRate
        return this.random()
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

        const newBirds = []
        var bird = new Bird()
        bird.copy(this.best, true)
        newBirds.push(bird)

        for (let i = 0; i < POPULATION - 1; i++) {
            bird = new Bird()
            if (Math.random() > .1)
                bird.copy(this.best)
            newBirds.push(bird)
        }

        return newBirds
    }
}