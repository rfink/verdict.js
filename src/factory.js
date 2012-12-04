var verdict = require('verdict');

/**
 * Factory builder for recursively turning an anonymous data structure into a
 *   verdict ready to be compiled.
 * @param object contextData
 * @param object dataStructure
 * @return verdict
 */
var factory = function(contextData, dataStructure, options) {
	var options = options || {};
	if (dataStructure === null || typeof dataStructure === 'undefined') return new verdict.comparison.truth(contextData);
	if (!dataStructure.nodeType) return null;
	var nodeType = dataStructure.nodeType.toLowerCase();
	switch (nodeType) {
		case 'composite':
			var children = [];
			dataStructure.children.forEach(function(child) {
				children.push(factory(contextData, child, options));
			});
			return new verdict.composite[dataStructure['nodeDriver']](children);
			break;
		case 'comparison':
			var cfgVal = (typeof dataStructure.configValue === 'string' && !+options.caseSensitive) ? dataStructure.configValue.toLowerCase() : dataStructure.configValue;
			var ret = new verdict.comparison[dataStructure['nodeDriver']](contextData, dataStructure.contextKey, cfgVal);
			ret.params = dataStructure.params || {};
			return ret;
			break;
		default:
			throw new Error('Node type does not match');
	}
};

exports = module.exports = factory;
