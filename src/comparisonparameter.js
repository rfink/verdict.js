var _ = require('underscore');

exports = module.exports = ComparisonParameter;

/**

	Example config:
	new ComparisonParameter({
		name: 'PropertyName',
		/**
		 * Source is a function returning a list of possible values/labels to the callback
		 *   for filtering purposes.
		 * @param  {Function} callback
		 * @return {object}
		 *
		source: function(callback) {
			return callback(null, [
				{
					label: '',
					value: ''
				},
				{
					label: '',
					value: ''
				}
			]);
		},
		/**
		 * Whether or not the returned values are a restricted set
		 * @type {Boolean}
		 *
		isRestrictedSet: false
	});

 */

function ComparisonParameter(options) {
	this.options = options || {};
	_.defaults(this.options, {
		isRestrictedSet: false
	});
}
