var _ = require('underscore');
var async = require('async');

var composite = exports = module.exports = {};

/**
 * Interface defining properties && public methods for the composite comparison objects
 * @return composite
 */
var compositeInterface = function(children, debug) {
	this.children = children || [];
	this.nodeType = '';
	this.nodeDriver = '';
	this.debug = debug || {
		events: []
	};
};

compositeInterface.prototype.evaluate = function(callback) {};

var template = {
	all: {
		evaluate: function(callback) {
			var self = this;
			this.debug.events.push({
				event: 'Beginning evaluation of "AND" block'
			});
			async.detectSeries(this.children,
				function(child, iteratorCallback) {
					child.evaluate(function(err, result) {
						if (err) return callback(err);
						if (!result) {
							iteratorCallback(true);
							self.debug.events.push({
								event: '"AND" block evaluated to false'
							});
							callback(null, false);
						} else {
							iteratorCallback(false);
						}
					});
				},
				function(result) {
					if (typeof result === 'undefined') {
						self.debug.events.push({
							event: '"AND" block evaluated to true'
						});
						callback(null, true);
					}
				}
			);
		},
		toSql: function() {
			var ret = [];
			this.children.forEach(function(Child) {
				ret.push(Child.toSql());
			});
			return "(\n\t" + ret.join("\n\tAND ") + "\n)";
		},
		toMongoQuery: function() {
			var obj = {};
			for (var key in this.children) {
				if (this.children[key].toMongoQuery) _(obj).extend(this.children[key].toMongoQuery());
			}
			return obj;
		}
	},
	any: {
		evaluate: function(callback) {
			var self = this;
			this.debug.events.push({
				event: 'Beginning evaluation of "OR" block'
			});
			async.detectSeries(this.children,
				function(child, iteratorCallback) {
					child.evaluate(function(err, result) {
						if (err) return callback(err);
						if (result) {
							iteratorCallback(true);
							self.debug.events.push({
								event: '"OR" block evaluated to true'
							});
							callback(null, true);
						} else {
							iteratorCallback(false);
						}
					});
				},
				function(result) {
					if (typeof result === 'undefined') {
						self.debug.events.push({
							event: '"OR" block evaluated to false'
						});
						callback(null, false);
					}
				}
			);
		},
		toSql: function() {
			var ret = [];
			this.children.forEach(function(Child) {
				ret.push(Child.toSql());
			});
			return "(\n\t" + ret.join("\n\tOR ") + "\n)";
		},
		toMongoQuery: function() {
			var arr = [];
			for (var key in this.children) {
				if (this.children[key].toMongoQuery) arr.push(this.children[key].toMongoQuery());
			}
			return {'$or': arr};
		}
	},
	none: {
		evaluate: function(callback) {
			var self = this;
			this.debug.events.push({
				event: 'Beginning evaluation of "NONE" block'
			});
			async.detectSeries(this.children,
				function(child, iteratorCallback) {
					child.evaluate(function(err, result) {
						if (err) return callback(err);
						if (result) {
							iteratorCallback(true);
							self.debug.events.push({
								event: '"NONE" block evaluated to false'
							});
							callback(null, false);
						} else {
							iteratorCallback(false);
						}
					});
				},
				function(result) {
					if (typeof result === 'undefined') {
						self.debug.events.push({
							event: '"NONE" block evaluated to true'
						});
						callback(null, true);
					}
				}
			);
		},
		toSql: function() {
			var ret = [];
			this.children.forEach(function(Child) {
				ret.push(Child.toSql());
			});
			return "(\n\t" + ret.join("\nAND NOT") + "\n)";
		},
		toMongoQuery: function() {
			var arr = [];
			for (var key in this.children) {
				if (this.children[key].toMongoQuery) arr.push(this.children[key].toMongoQuery());
			}
			return {'$nor': arr};
		}
	}
};

// Bootstrap our prototypes
Object.keys(template).forEach(function(key) {
	var ctor = function() {
		compositeInterface.apply(this, arguments);
		this.nodeType = 'composite';
		this.nodeDriver = key;
	};
	ctor.prototype = template[key];
	composite[key] = ctor;
});
