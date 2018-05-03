
import Neuron from './neuron'
import BackPropagation from './backpropagation'

export default class Network {

	/**
	 * Prepares the neurons for the network. Either from regular invokation like: new Network([2,3,1])
	 * or pass in another Network class to `clone` it
	 * @param  {array | Network} layers
	 *
	 */
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

	/**
	 * Adds a hidden layer to the network with one neuron in it
	 */
	addHiddenLayer () {
		const outputLayer = this.neurons.splice(-1),
			  newNeuron = new Neuron(this.neurons.length)
		this.neurons[this.neurons.length] = []
		this.neurons[this.neurons.length - 1].push(newNeuron)
		this.recalculateWeigths(this.neurons.length - 1)
		this.neurons[this.neurons.length] = outputLayer[0]
		this.recalculateWeigths(this.neurons.length - 1)
	}

	/**
	 * Adds one neuron to a layer of choice
	 * @param {int} layer  	the layer index
	 */
	addNeuron (layer) {
		const neuron = new Neuron(layer)
		neuron.initializeWeights(this.neurons[layer - 1])
		this.neurons[layer].push(neuron)
		this.recalculateWeigths(layer + 1)
	}

	/**
	 * Recalculates the weights for a given layer
	 * @param  {int} layer  the layer index
	 */
	recalculateWeigths (layer) {
		for (var i = 0; i < this.neurons[layer].length; i++) {
			this.neurons[layer][i].initializeWeights(this.neurons[layer - 1])
		}
	}

	/**
	 * Feed-forward algorithm
	 * @param  {...[int]} args
	 */
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

	/**
	 * Prepares the output for the network
	 * @return {int} 
	 */
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

	/**
	 * Uses backpropagation to train the neural network
	 * @param  {array} inputData 
	 * @param  {array} outputData
	 */
	train (inputData, outputData) {
		this.input.apply(this, inputData)
		const answer = this.output()

		const errors = BackPropagation.findError(answer, outputData)
		console.log('ERRORS',answer, errors)
		for (var l = this.neurons.length - 1; l > 1; l--) {
			const gradients = BackPropagation.findGradients(answer, errors, .70),
				  deltas = BackPropagation.findDeltas(gradients, this.neurons[l])

			this.adjustWeights(l, deltas)
			this.adjustBiases(l, gradients)
		}
	}

	adjustWeights (layer, values) {
		for (var i = 0; i < this.neurons[layer].length; i++) 
			for (var j = 0; j < this.neurons[layer][i].weights.length; j++) {
				console.log('Adjusting weight from ', this.neurons[layer][i].weights[j], 'to', this.neurons[layer][i].weights[j] += values[j])
				this.neurons[layer][i].weights[j] += values[j]
			}
	}

	adjustBiases (layer, values) {
		for (var i = 0; i < this.neurons[layer].length; i++) 
			this.neurons[layer][i].bias += values[i]
	}

	/**
	 * Returns the output from a layer
	 * @param  {array} layer   array of neurons
	 * @return {array}
	 */
	getLayerOutput (layer) {
		if (!layer)
			throw new Error('A valid layer needs to be passed to get the outputs')

		var outputs = []
		for (var i = 0; i < layer.length; i++) {
			outputs.push(layer[i].output)
		}
		return outputs
	}

	/**
	 * Clones the network
	 * @return {Network}
	 */
	copy () {
		return new Network(this)
	}

	/**
	 * Returns the `brain` of the network
	 * @return {array}
	 */
	getJson () {
		return this.neurons
	}

	// OBS: Experimental. Do not use
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

}