var _ = require('underscore');
var ContextProperty = require('./contextproperty');

exports = module.exports = Context;

/**
 * Constructor, optionally pass in the data
 * @param object data
 * @param string delimiter
 * @return Context
 */
function Context(model, contextData, delimiter) {
	if (!(this instanceof Context)) return new Context(model, contextData, delimiter);
	this.data = model || {};
	if (contextData) this.mergeInto(this.data, contextData);
	this._delimiter = delimiter || '::';
}

/**
 * This function allows us to namespace our keys to the object, so we can
 *   access nested members.  Simply give the value as "KeyLevel1::KeyLevel2::KeyLevel3", and
 *   this function will traverse our data and return the value
 * @param string name
 * @return mixed
 */
Context.prototype.getValue = function(name, callback) {
	var vname = name || '';
	var _d = this.data;
	var keys = vname.split(this._delimiter);

	while (true) {
		if (keys.length === 1) {
			var curKeys = _d[keys[0]];
			// If for some reason we are requesting something that doesn't exist
			if (!curKeys || (curKeys && typeof curKeys.options === 'undefined')) {
				return callback(new Error('Property ' + name + ' is either not found or not a context property object'));
			}
			if (typeof curKeys.options.getValue === 'function') {
				return curKeys.options.getValue.call(this, function(err, res) {
					if (err) return callback(err);
					var v = (typeof res === 'string') ? res.toLowerCase() : res;
					return callback(null, v);
				});
			} else {
				return callback(null, curKeys.options.myValue);
			}
		}
		_d = _d[keys.shift()];
	}
};

/**
 * Get our ContextProperty object
 * @param  {string} name
 * @return {object}
 */
Context.prototype.getProperty = function(name) {
	var vname = name || '';
	var _d = this.data;
	var keys = vname.split(this._delimiter);

	while (true) {
		if (keys.length === 1) {
			return _d[keys[0]];
		}
		_d = _d[keys.shift()];
	}
};

/**
 * Get the name of our bottom key (last elements after splitting on delimiter)
 * @param string name
 * @return string
 */
Context.prototype.getBottomKey = function(name) {
	var arr = name.split(this._delimiter);
	return arr[arr.length - 1];
};

/**
 * Get our nest delimiter
 * @return {string}
 */
Context.prototype.getDelimiter = function() {
	return this._delimiter;
};

/**
 * Set our value on the object, using our key namespacing convention.
 * @param string name
 * @param mixed value
 */
Context.prototype.setValue = function(name, value) {
	if (typeof name !== 'string' || name.length < 1) throw new Error('Invalid variable name');
	var keys = name.split(this._delimiter);
	var _d = this.data;
	
	while (true) {
		if (keys.length === 1) {
			_d[keys[0]].options.myValue = value;
			return this;
		}
		var k = keys.shift();
		if (typeof _d[k] === 'undefined') _d[k] = {};
		_d = _d[k];
	}
};

/**
 * Merge the authority object into the mergee context
 * @param object authority
 * @param object mergee
 * @return void
 */
Context.prototype.mergeInto = function(authority, mergee) {
	var self = this;
	
	// Cannot merge non-objects
	if(typeof(authority) !== "object" || typeof(mergee) !== "object") return false;

	Object.keys(authority).forEach(function(key) {
		// Make sure this is not a function on the authority
		if(!authority[key].options || (authority[key].options && !_.isFunction(authority[key].options.getValue))) {
			// Check the mergee to see if it has the same property
			if(mergee.hasOwnProperty(key)) {
				if (mergee[key] instanceof Date) {
					authority[key].options.myValue = mergee[key];
				// Check to see if mergee and authority both have objects at this level
				} else if(authority[key] !== null && typeof(authority[key]) === "object" && !(authority[key] instanceof ContextProperty) && typeof(mergee[key]) === "object") {
					self.mergeInto(authority[key], mergee[key]);
				// Before setting, make sure that 
				//	 - the authority is an existing attribute that has a null value
				//   - the mergee is not an object
				} else if(Array.isArray(mergee[key]) || typeof(mergee[key]) !== "object") {
					authority[key].options.myValue = mergee[key];
				}
			} 
		} 
	});
};


/**
 * Strip the functions so we can json encode correctly
 * @return {object}
 */
Context.prototype.stripFunctions = function() {
	return (function recurse(d, returnContainer) {
		returnContainer = returnContainer || {};
		Object.keys(d).forEach(function(key) {
			if (d[key] instanceof ContextProperty) {
				var excludedDrivers = [];
				var includedDrivers = [];
				d[key].options.excludedDrivers.forEach(function(exclude) {
					excludedDrivers.push(exclude.myName);
				});
				d[key].options.includedDrivers.forEach(function(include) {
					includedDrivers.push(include.myName);
				});
				returnContainer[key] = {
					excludedDrivers: excludedDrivers,
					includedDrivers: includedDrivers,
					isRestrictedSet: d[key].options.isRestrictedSet,
					hasSource: (typeof d[key].options.source === 'function'),
					isContextProperty: true
				};
				// Send back our type
				switch (d[key].options.type) {
					case Date:
						returnContainer[key].type = 'date';
						break;
					case String:
						returnContainer[key].type = 'string';
						break;
					case Boolean:
						returnContainer[key].type = 'boolean';
						break;
					case Number:
						returnContainer[key].type = 'number';
						break;
					case Array:
						returnContainer[key].type = 'array';
						break;
					default:
						returnContainer[key].type = 'string';
				}
			} else {
				returnContainer[key] = recurse(d[key], returnContainer[key]);
			}
		});
		return returnContainer;
	})(this.data);
};
