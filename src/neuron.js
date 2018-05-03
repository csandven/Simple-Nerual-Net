import { random } from './utilities'

export default class Neuron {
	
	constructor (layerIndex) {
		this.layerIndex = layerIndex
		this.weights = []
		this.bias = 0

		this.inputs = []
		this.output = null
	}

	/**
	 * Initializes the weights in front of the neuron. 
	 * Takes in an array of neurons from the layer before this layer. 
	 * @param  {array<Neruon>} layer
	 */
	initializeWeights (layer) {
		this.weights = []
		for (var i = 0; i < layer.length; i++) {
			this.weights.push(+random(-1, 1).toFixed(4))
		}
	}

	/**
	 * Sets the input of the neuron. For instance the initial
	 * inputs to the neural network, or the input from the previous layer.
	 * @param {...array} args
	 */
	setInput (...args) {
		this.inputs = args[0]
	}

	/**
	 * Calculates the output for this neuron. 
	 * Σ(WiXi), where W is the vector of synaptic weights, and X is for the inputs.
	 * @return {[type]} [description] 
	 */
	prepareOutput () {
		if (this.inputs.length !== this.weights.length)
			throw new Error('Number of passed inputs must match the number neurons weights')

		// Store the XiWi values in an array
		var values = []
		for (var i = 0; i < this.inputs.length; i++) {
			values.push(this.inputs[i] * this.weights[i])
		}

		// Run sigmoid on the sum + bias value of the neuron
		this.output = this.sigmoid(values.reduce((a,b) => a + b, 0) + this.bias)
	}
	
	/**
	 * Sets weights from outside
	 * @param {array} weights 
	 */
	setWeights (weights) {
		this.weights = []
		for (var i = 0; i < weights.length; i++) {
			this.weights.push(weights[i])
		}
	}

	/**
	 * Sets the bias value from outside
	 * @param {int} bias
	 */
	setBias (bias) {
		this.bias = bias
	}

	/**
	 * Return the logistic value in the sigmoid curve
	 * @param  {int} t 
	 * @return {int}  
	 */
	sigmoid (t) {
	    return 1/(1+Math.exp(-t))
	}

	// @TODO: Add more activation functions like tahn, ReLU and Linear

}