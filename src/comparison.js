var ComparisonParameter = require('./comparisonparameter');
var debug = require('./debug');

/**
 * Interface defining properties && public methods for the comparison objects
 * @param verdict.context context
 * @param string contextKey
 * @param mixed configValue
 * @return comparison
 */
var comparisonInterface = function(context, contextKey, configValue) {
	this.context = context;
	this.contextKey = contextKey;
	this.contextValue;
	this.configValue = configValue;
	this.params = {};
	this.nodeType = '';
	this.nodeDriver = '';
};

/**
 * Evaluate will be our only required public method
 * @return void
 */
comparisonInterface.prototype.evaluate = function(callback) {};

// Export this stuff
var comparison = exports = module.exports = {};

var quote = function(input) {
	switch(typeof input) {
		case 'boolean': return input ? 'TRUE' : 'FALSE'; break;
		case 'number': return input; break;
		case 'string': return '"' + input + '"'; break;
		case 'undefined':
		case 'object':
			if (input === null) return 'NULL';
			return input.toString();
			break;
	}
};

var mongoFormatValue = function(input, context, propertyName) {
	var prop = context.getProperty(propertyName);
	if (!prop) return null;
	if (prop.options.type === Number) {
		return parseFloat(input);
	} else if (prop.options.type === Boolean) {
		if (input === '0') {
			return false;
		}
		return !!input;
	}
	return input;
};

var regExEscape = function(str) {
	return str.replace(new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"), "\\$&");
};
	
var template = {
	equals: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value == self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' = ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
			
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' = ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = mongoFormatValue(this.configValue, this.context, this.contextKey);
			return obj;
		},
		display: '=',
		requiresConfig: true
	},

	notEquals: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value != self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' != ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' != ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$ne': mongoFormatValue(this.configValue, this.context, this.contextKey)};
			return obj;
		},
		display: '!=',
		requiresConfig: true
	},

	identical: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value === self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' === ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' = BINARY ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = this.configValue;
			return obj;
		},
		display: '==',
		requiresConfig: true
	},

	notIdentical: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value !== self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' !== ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' != BINARY ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$ne': this.configValue};
			return obj;
		},
		display: '!==',
		requiresConfig: true
	},

	lessThan: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value < self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' < ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' < ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$lt': mongoFormatValue(this.configValue, this.context, this.contextKey)};
			return obj;
		},
		display: '<',
		requiresConfig: true
	},

	greaterThan: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value > self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' > ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' > ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$gt': mongoFormatValue(this.configValue, this.context, this.contextKey)};
			return obj;
		},
		display: '>',
		requiresConfig: true
	},

	lessThanEqualTo: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value <= self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' <= ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' <= ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$lte': mongoFormatValue(this.configValue, this.context, this.contextKey)};
			return obj;
		},
		display: '<=',
		requiresConfig: true
	},

	greaterThanEqualTo: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value >= self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' >= ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' >= ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$gte': mongoFormatValue(this.configValue, this.context, this.contextKey)};
			return obj;
		},
		display: '>=',
		requiresConfig: true
	},

	contains: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (!value.hasOwnProperty('length')) return callback(new Error('Configuration must be an array or object'));
				var result = false;
				for (var i = 0, len = value.length; i < len; ++i) {
					if (value[i] == self.configValue) {
						result = true;
						break;
					}
				}
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' IN ( ' + JSON.stringify(self.configValue) + ' ) - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			throw new Error('Not yet implemented');
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$in': this.configValue};
			return obj;
		},
		display: 'List Has',
		requiresConfig: true
	},

	notContains: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (!value.hasOwnProperty('length')) return callback(new Error('Configuration must be an array or object'));
				var result = true;
				for (var i = 0, len = value.length; i < len; ++i) {
					if (value[i] == self.configValue) {
						result = false;
						break;
					}
				}
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' NOT IN ( ' + JSON.stringify(self.configValue) + ' ) - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			throw new Error('Not yet implemented');
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$nin': this.configValue};
			return obj;
		},
		display: 'List Not Has',
		requiresConfig: true
	},

	stringContains: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof value !== 'string') return callback(new Error('Value is not a string, context key ( ' + self.contextKey + ' )'));
				var result = (value.indexOf(self.configValue) !== -1);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' CONTAINS ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' LIKE ' + quote('%' + this.configValue + '%');
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$regex': regExEscape(this.configValue), '$options': 'i'};
			return obj;
		},
		display: 'Contains',
		requiresConfig: true
	},

	stringNotContains: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof value !== 'string') return callback(new Error('Value is not a string, context key ( ' + self.contextKey + ' )'));
				var result = (value.indexOf(self.configValue) === -1);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' NOT CONTAINS ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' NOT LIKE ' + quote('%' + this.configValue + '%');
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$not': new RegExp(regExEscape(this.configValue), 'i')};
			return obj;
		},
		display: 'Not Contains',
		requiresConfig: true
	},

	lengthOf: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof value !== 'string' && !Array.isArray(value)) {
					return callback(new Error('Must be a string or array'));
				}
				var result = (value.length == self.configValue);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' IS LENGTH ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return 'CHAR_LENGTH(' + this.context.getBottomKey(this.contextKey) + ') = ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$size': this.configValue};
			return obj;
		},
		display: 'Has Length',
		requiresConfig: true
	},

	regEx: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof self.configValue !== 'string' || typeof value !== 'string') {
					return callback(new Error('Key or value is not a string'));
				}
				var result = (new RegExp(self.configValue, 'i')).test(value);
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' MATCHES REGEX ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' REGEX ' + quote(this.configValue);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {};
			obj[keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.')] = {'$regex': this.configValue, '$options': 'i'};
			return obj;
		},
		display: 'Reg Ex',
		requiresConfig: true
	},

	range: {
		evaluate: function(callback) {
			var self = this;
			this.context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof self.params.min === 'undefined' || typeof self.params.max === 'undefined') {
					return callback(new Error('Min and Max must both be defined'));
				}
				var result = value >= self.params.min && value <= self.params.max;
				debug.addEvent({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' IN RANGE (' + self.params.min + ', ' + self.params.max + ') - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.context.getBottomKey(this.contextKey) + ' BETWEEN ' + quote(self.params.min) + ' AND ' + quote(self.params.max);
		},
		toMongoQuery: function(keyPrefix) {
			var obj = {
				'$and': [{}, {}]
			};
			var allKey = keyPrefix + '.' + this.contextKey.replace(this.context.getDelimiter(), '.');
			obj['$and'][0][allKey] = {
				'$gte': this.params.min
			};
			obj['$and'][1][allKey] = {
				'$lte': this.params.max
			};
			return obj;
		},
		display: 'In Range',
		requiresConfig: false,
		params: [
			new ComparisonParameter({
				name: "min"
			}),
			new ComparisonParameter({
				name: "max"
			})
		]
	},
	
	truth: {
		evaluate: function(callback) {
			debug.addEvent({
				event: 'Called always true comparison - result (true)'
			});
			return callback(null, true);
		},
		toSql: function() {
			return '1';
		},
		toMongoQuery: function(keyPrefix) {
			return {};
		},
		display: 'Always True',
		requiresConfig: false
	}
};

Object.keys(template).forEach(function(key) {
	var ctor = function() {
		comparisonInterface.apply(this, arguments);
		this.nodeType = 'comparison';
		this.nodeDriver = key;
	};
	ctor.prototype = template[key];
	ctor.prototype.toJSON = function() {
		var obj = {};
		for (var key in this) {
			if (key !== '_context') obj[key] = this[key];
		}
		return obj;
	};
	comparison[key] = ctor;
	comparison[key].myName = key;
});
