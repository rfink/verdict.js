
var selectn = require('selectn');
var comparators = require('./comparison');

module.exports = Rule;

function Rule(rule) {
  if (!(this instanceof Rule)) {
    return new Rule(rule);
  }
  rule = rule || {};
  this.path = rule.path || '';
  this.comparator = rule.comparator || '';
  this.value = rule.value || '';
  this.invert = !!rule.invert;
}

/**
 * Test our rule with the given context.
 *   If a second argument is supplied and is a callback,
 *   we will pass the results to that async-style
 */
Rule.prototype.test = function test(context) {
  var val = selectn(this.path, context);
  var comparator = comparators[this.comparator];

  if (!comparator) {
    throw new Error('Invalid comparator or comparator not supplied');
  }

  return !!(comparator.call(null, val, this.value) ^ this.invert);
};
