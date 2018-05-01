
import Neuron from './neuron'

export default class Network {
	
	constructor (layers) {
		if (layers instanceof Network) {
			this.neurons = Object.assign([], layers.neurons)
		} else {
			this.neurons = []

			// Setup the layers
			for (var i = 0; i < layers.length; i++) {
				for (var j = 0; j < layers[i]; j++) {
					this.neurons[i] = this.neurons[i] || []
					this.neurons[i].push(new Neuron(i))
				}
			}

			// Setup the weights based on the previous layer
			for (var i = 1; i < layers.length; i++) {
				for (var j = 0; j < layers[i]; j++) {
					this.neurons[i][j].initializeWeights(this.neurons[i - 1])
				}
			}
		}
	}

	addHiddenLayer () {
		const outputLayer = this.neurons.splice(-1),
			  newNeuron = new Neuron(this.neurons.length)
		this.neurons[this.neurons.length] = []
		this.neurons[this.neurons.length - 1].push(newNeuron)
		this.recalculateWeigths(this.neurons.length - 1)
		this.neurons[this.neurons.length] = outputLayer[0]
		this.recalculateWeigths(this.neurons.length - 1)
	}

	addNeuron (layer) {
		const neuron = new Neuron(layer)
		neuron.initializeWeights(this.neurons[layer - 1])
		this.neurons[layer].push(neuron)
		this.recalculateWeigths(layer + 1)
	}

	recalculateWeigths (layer) {
		for (var i = 0; i < this.neurons[layer].length; i++) {
			this.neurons[layer][i].initializeWeights(this.neurons[layer - 1])
		}
	}

	input (...args) {
		if (args.length !== this.neurons[0].length)
			throw new Error('Number of passed inputs must match the number of input neurons')

		for (var i = 0; i < this.neurons[0].length; i++) {
			this.neurons[0][i].output = args[i]
		}

		for (var n = 1; n < this.neurons.length; n++) {
			for (var i = 0; i < this.neurons[n].length; i++) {
				const inputs = this.getLayerOutput(this.neurons[n - 1])
				this.neurons[n][i].setInput(inputs)
				this.neurons[n][i].prepareOutput()
			}
		}
	}

	output () {
		const lastLayer = this.neurons[this.neurons.length - 1]

		const out = lastLayer.map(neuron => neuron.output)

		// Clear the neuron outputs
		for (var i = 0; i < this.neurons.length; i++) {
			for (var j = 0; j < this.neurons[i].length; j++) {
				this.neurons[i][j].output = null
			}
		}

		return out
	}

	getLayerOutput (layer) {
		if (!layer)
			throw new Error('A valid layer needs to be passed to get the outputs')

		var outputs = []
		for (var i = 0; i < layer.length; i++) {
			outputs.push(layer[i].output)
		}
		return outputs
	}

	copy () {
		return new Network(this)
	}

	getJson () {
		return this.neurons
	}

	fromJson (json) {
		// Setup the layers
		for (var i = 0; i < json.length; i++) {
			for (var j = 0; j < json[i]; j++) {
				this.neurons[i] = this.neurons[i] || []

				const neuron = new Neuron(i)
				neuron.setWeights(json[i].weights)
				neuron.setBias(json[i].bias)
				this.neurons[i].push(neuron)
			}
		}
	}

	static newNeuron (layerIndex, bird) {
		const neuron = new Neuron(layerIndex)
		neuron.initializeWeights(bird.brain.neurons[layerIndex - 1])
		return neuron
	}

}