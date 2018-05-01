import { random } from './utilities'

export default class Neuron {
	
	constructor (layerIndex) {
		this.layerIndex = layerIndex
		this.weights = []
		this.bias = 0

		this.inputs = []
		this.output = null
	}

	initializeWeights (layer) {
		this.weights = []
		for (var i = 0; i < layer.length; i++) {
			this.weights.push(+random(-2, 2).toFixed(4))
		}
	}

	setInput (...args) {
		this.inputs = args[0]
	}

	prepareOutput () {
		if (this.inputs.length !== this.weights.length)
			throw new Error('Number of passed inputs must match the number neurons weights')

		var values = []
		for (var i = 0; i < this.inputs.length; i++) {
			values.push(this.inputs[i] * this.weights[i])
		}

		this.output = this.sigmoid(values.reduce((a,b) => a + b, 0) + this.bias)
	}

	normalizeInputs (inputs) {
		const inSum = inputs.reduce((a,b) => a + b, 0)

		var newValues = []
		for (var i = 0; i < inputs.length; i++) {
			newValues.push(inputs[i] / inSum)
		}
		
		return newValues
	}
	
	setWeights (weights) {
		this.weights = []
		for (var i = 0; i < weights.length; i++) {
			this.weights.push(weights[i])
		}
	}

	setBias (bias) {
		this.bias = bias
	}

	sigmoid (t) {
	    return 1/(1+Math.exp(-t))
	}

}