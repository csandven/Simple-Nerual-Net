
export default class BackPropagation {
	
	static findError (outputs, targets) {
		if (outputs.length !== targets.length)
			throw new Error('BackPropagation.findError: Number of passed outputs must match the number of targets')

		let errors = Array(targets.length)
		for (var i = 0; i < outputs.length; i++)
			errors[i] = targets[0] - outputs[i]

		return errors
	}

	static findGradients (outputs, errors, learningRate) {
		if (outputs.length !== errors.length)
			throw new Error('BackPropagation.findGradients: Number of passed outputs must match the number of errors')

		let gradients = outputs.map(this.dsigmoid)
		for (var i = 0; i < outputs.length; i++) {
			gradients[i] *= errors[i]
			gradients[i] *= learningRate
		}

		return gradients
	}

	static findDeltas (gradients, layer) {
		if (gradients.length !== layer.length)
			throw new Error('BackPropagation.findDeltas: Number of passed gradients must match the number of neurons in the layer')

		let deltas = []
		for (var i = 0; i < gradients.length; i++)
			for (var j = 0; j < layer[i].weights.length; j++)
				deltas[j * (i+1)] = gradients[i] * layer[i].weights[j]

		return deltas
	}

	static dsigmoid (val) {
		return val * (1 - val)
	}

}