var _ = require('underscore');
var comparisons = require('verdict/comparison');

exports = module.exports = ContextProperty;

/**

	Example config:
	new ContextProperty({
		value: null,
		/**
		 * List of excluded verdict.comparison objects
		 *   Example: [
		 *   	verdict.comparison.equals,
		 *   	verdict.comparison.notEquals
		 *   ]
		 *   NOTE:  Must be the object, not a string
		 *
		excludedDrivers: [],
		/**
		 * Same as above, but only include these drivers
		 *
		includedDrivers: [],
		/**
		 * Javascript native type, can help auto-filter the drivers that are available
		 *   Allowable values: Array, Number, String, Boolean, Date
		 *
		type: String,
		/**
		 * Source should optionally be a function with a signature as follows:
		 *   (props, callback)
		 * Properties being additional properties the data source needs to use to filter
		 * Callback being a function that has accepts (optionally) an error as the first
		 *   argument, and the result as the second argument.  Result should be an array
		 *   of objects that follows the following structure:
		 *   [
		 *   	{
		 *   		key: '1',
		 *   		value: 'Company 1'
		 *   	},
		 *   	{
		 *   		key: '2',
		 *   		value: 'Company 2'
		 *   	}
		 *   ]
		 * 
		source: null,
		/**
		 * Is our allowable value field restricted?  I.E. drop-down versus also
		 * allowing free-style typing
		 *
		isRestrictedSet: false,
		/**
		 * Value can optionally be a function that asynchronously retrieves the value
		 *   needed for the context. This may be an API call, database lookup, anything
		 *   that isn't passed in but needs to be determined.
		 * Function signature should be as follows:
		 *   (callback) - callback being a function that accepts (optionally) an error
		 *   as the first argument, and the value as the second argument.
		 *
		getValue: null
	})

*/

/**
 * Constructor for context property variables, container for all
 *   different flavors of logic to make these things rock (see above)
 * @param {object} options
 * @return {object}
 */
function ContextProperty(options) {
	this.options = options || {};
	switch(this.options.type) {
		case Number:
			_.defaults(this.options, {
				myValue: null,
				excludedDrivers: [
					comparisons.stringContains,
					comparisons.stringNotContains,
					comparisons.lengthOf,
					comparisons.regEx,
					comparisons.contains,
					comparisons.notContains
				],
				includedDrivers: [],
				type: String,
				source: null,
				isRestrictedSet: true,
				getValue: null
			});
			break;
		case Boolean:
			_.defaults(this.options, {
				myValue: null,
				excludedDrivers: [],
				includedDrivers: [
					comparisons.equals,
					comparisons.notEquals
				],
				type: Boolean,
				source: function(params, callback) {
					return callback(null, [
						{
							value: '1',
							label: 'True'
						},
						{
							value: '0',
							label: 'False'
						}
					]);
				},
				isRestrictedSet: true,
				getValue: null
			});
			break;
		case Array:
			_.defaults(this.options, {
				myValue: null,
				excludedDrivers: [],
				includedDrivers: [
					comparisons.contains,
					comparisons.notContains
				],
				type: Array,
				source: null,
				isRestrictedSet: false,
				getValue: null
			});
			break;
		// TODO: Figure some stuff out on this one
		case Date:
			_.defaults(this.options, {
				myValue: null,
				excludedDrivers: [],
				includedDrivers: [
					comparisons.equals,
					comparisons.notEquals,
					comparisons.lessThan,
					comparisons.greaterThan,
					comparisons.lessThanEqualTo,
					comparisons.greaterThanEqualTo,
					comparisons.range
				],
				type: Date,
				isRestrictedSet: true,
				getValue: null
			});
			break;
		// Break intentionally omitted
		case String:
		default:
			_.defaults(this.options, {
				myValue: '',
				excludedDrivers: [
					comparisons.contains,
					comparisons.notContains
				],
				includedDrivers: [],
				type: String,
				source: null,
				isRestrictedSet: false,
				getValue: null
			});
	}
}