/**
 * Interface defining properties && public methods for the comparison objects
 * @param verdict.context Context
 * @param string contextKey
 * @param mixed configValue
 * @return comparison
 */
var comparisonInterface = function(Context, contextKey, configValue, debug) {
	this.Context = Context;
	this.contextKey = contextKey;
	this.contextValue;
	this.configValue = configValue;
	this.nodeType = '';
	this.nodeDriver = '';
	this.debug = debug || {
		events: []
	};
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
	
var template = {
	equals: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value == self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' = ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
			
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' = ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = this.configValue;
			return obj;
		},
		display: '=',
		requiresConfig: true
	},

	notEquals: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value != self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' != ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' != ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$ne': this.configValue};
			return obj;
		},
		display: '!=',
		requiresConfig: true
	},

	identical: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value === self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' === ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' = BINARY ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = this.configValue;
			return obj;
		},
		display: '==',
		requiresConfig: true
	},

	notIdentical: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value !== self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' !== ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' != BINARY ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$ne': this.configValue};
			return obj;
		},
		display: '!==',
		requiresConfig: true
	},

	lessThan: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value < self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' < ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' < ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$lt': this.configValue};
			return obj;
		},
		display: '<',
		requiresConfig: true
	},

	greaterThan: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value > self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' > ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' > ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$gt': this.configValue};
			return obj;
		},
		display: '>',
		requiresConfig: true
	},

	lessThanEqualTo: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value <= self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' <= ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' <= ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$lte': this.configValue};
			return obj;
		},
		display: '<=',
		requiresConfig: true
	},

	greaterThanEqualTo: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				var result = (value >= self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' >= ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' >= ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$gte': this.configValue};
			return obj;
		},
		display: '>=',
		requiresConfig: true
	},

	contains: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (!value.hasOwnProperty('length')) return callback(new Error('Configuration must be an array or object'));
				var result = false;
				for (var i = 0, len = value.length; i < len; ++i) {
					if (value[i] == self.configValue) {
						result = true;
						break;
					}
				}
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' IN ( ' + JSON.stringify(self.configValue) + ' ) - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			throw new Error('Not yet implemented');
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$in': this.configValue};
			return obj;
		},
		display: 'In List',
		requiresConfig: true
	},

	notContains: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (!value.hasOwnProperty('length')) return callback(new Error('Configuration must be an array or object'));
				var result = true;
				for (var i = 0, len = value.length; i < len; ++i) {
					if (value[i] == self.configValue) {
						result = false;
						break;
					}
				}
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' NOT IN ( ' + JSON.stringify(self.configValue) + ' ) - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			throw new Error('Not yet implemented');
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$nin': this.configValue};
			return obj;
		},
		display: 'Not In List',
		requiresConfig: true
	},

	stringContains: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof value.indexOf !== 'function') return callback(new Error('Value is not a string'));
				var result = (value.indexOf(self.configValue) !== -1);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' CONTAINS ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' LIKE ' + quote('%' + this.configValue + '%');
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$regex': this.configValue, '$options': 'i'};
			return obj;
		},
		display: 'Contains',
		requiresConfig: true
	},

	stringNotContains: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof value.indexOf !== 'function') return callback(new Error('Value is not a string'));
				var result = (value.indexOf(self.configValue) === -1);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' NOT CONTAINS ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' NOT LIKE ' + quote('%' + this.configValue + '%');
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$not': {'$regex': this.configValue, '$options': 'i'}};
			return obj;
		},
		display: 'Not Contains',
		requiresConfig: true
	},

	lengthOf: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof value !== 'string' && !Array.isArray(value)) {
					return callback(new Error('Must be a string or array'));
				}
				var result = (value.length == self.configValue);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' IS LENGTH ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return 'CHAR_LENGTH(' + this.Context.getBottomKey(this.contextKey) + ') = ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$size': this.configValue};
			return obj;
		},
		display: 'Has Length',
		requiresConfig: true
	},

	regEx: {
		evaluate: function(callback) {
			var self = this;
			this.Context.getValue(this.contextKey, function(err, value) {
				if (err) return callback(err);
				if (typeof self.configValue !== 'string' || typeof value !== 'string') {
					return callback(new Error('Key or value is not a string'));
				}
				var result = (new RegExp(self.configValue, 'i')).test(value);
				self.debug.events.push({
					event: 'Condition: (' + self.contextKey + ') ' + value + ' MATCHES REGEX ' + self.configValue + ' - result (' + (result ? 'true' : 'false') + ')'
				});
				return callback(null, result);
			});
		},
		toSql: function() {
			return this.Context.getBottomKey(this.contextKey) + ' REGEX ' + quote(this.configValue);
		},
		toMongoQuery: function() {
			var obj = {};
			obj[this.contextKey.replace(this.Context.getDelimiter(), '.')] = {'$regex': this.configValue, '$options': 'i'};
			return obj;
		},
		display: 'Reg Ex',
		requiresConfig: true
	},
	
	truth: {
		evaluate: function(callback) {
			this.debug.events.push({
				event: 'Called always true comparison - result (true)'
			});
			return callback(null, true);
		},
		toSql: function() {
			return '1';
		},
		toMongoQuery: function() {
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
			if (key !== '_Context') obj[key] = this[key];
		}
		return obj;
	};
	comparison[key] = ctor;
	comparison[key].myName = key;
});
