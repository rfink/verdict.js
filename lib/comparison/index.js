var weighted = require('weighted');
var versionCompare = require('version-compare.js');

/**
 * Just check if a exists, aka is a non empty value
 */
exports.exists = function exists(a) {
  return !!a;
};

/**
 * Make sure the variable is an empty value
 */
exports.nexists = function nexists(a) {
  return !a;
};

/**
 * Regular expression match
 */
exports.matches = function matches(a, b) {
  b = 'string' === typeof b ?
    new RegExp(b) :
    b;
  return b.test(a);
};

/**
 * Negative regular expression match
 */
exports.nmatches = function nmatches(a, b) {
  b = 'string' === typeof b ?
    new RegExp(b) :
    b;
  return !b.test(a);
};

/**
 * String contains
 */
exports.contains = function contains(a, b) {
  return !!~a.indexOf(b);
};

/**
 * String *not* contains
 */
exports.ncontains = function ncontains(a, b) {
  return !~a.indexOf(b);
};

/**
 * Check for non-strict equals
 */
exports.eq = function eq(a, b) {
  return a == b;
};

/**
 * Check for non-strict non-equals
 */
exports.neq = function neq(a, b) {
  return a != b;
};

/**
 * Check for strict equals
 */
exports.is = function is(a, b) {
  return a === b;
};

/**
 * Check for strict non-equals
 */
exports.not = function not(a, b) {
  return a !== b;
};

/**
 * Check for greater than
 */
exports.gt = function gt(a, b) {
  return a > b;
};

/**
 * Check for greater than/equal to
 */
exports.gte = function gte(a, b) {
  return a >= b;
};

/**
 * Check for less than
 */
exports.lt = function lt(a, b) {
  return a < b;
};

/**
 * Check for less than/equal to
 */
exports.lte = function lte(a, b) {
  return a <= b;
};

/**
 * Check if value is in a range
 */
exports.inRange = function inRange(a, b) {
  return a >= b[0] && a <= b[1];
};

/**
 * Check if value is *not* in a range
 */
exports.ninRange = function ninRange(a, b) {
  return a < b[0] || a > b[1];
};

/**
 * Check if value is evenly divisible by
 */
exports.divisibleBy = function divisibleBy(a, b) {
  return a % b === 0;
};

/**
 * Check if value is *not* evenly divisible by
 */
exports.ndivisibleBy = function ndivisibleBy(a, b) {
  return a % b !== 0;
};

/**
 * Check if probability of weight fits (TODO: Desc and name)
 */
exports.weight = function weight(a, b) {
  return weighted([true, false], [b, 1 - b]);
};

/**
 * Check if probability of weight *not* fits (TODO: Desc and name)
 */
exports.nweight = function nweight(a, b) {
  return weighted([false, true], [b, 1 - b]);
};

/**
 * Use software version logic, compare a to b and check for equality
 */
exports.eqVersion = function eqVersion(a, b) {
  return !versionCompare(a, b);
};

/**
 * Check if version a is greater than version b
 */
exports.gtVersion = function gtVersion(a, b) {
  return versionCompare(a, b) === -1;
};

/**
 * Check if version a is greater or equal to than version b
 */
exports.gteVersion = function gteVersion(a, b) {
  var cmp = versionCompare(a, b);
  return cmp === 0 || cmp === -1;
};

/**
 * Check if version a is less than version b
 */
exports.ltVersion = function ltVersion(a, b) {
  return versionCompare(a, b) === 1;
};

/**
 * Check if version a is less than or equal to version b
 */
exports.lteVersion = function lteVersion(a, b) {
  var cmp = versionCompare(a, b);
  return cmp === 0 || cmp === 1;
};

/**
 * Compile manual javascript with variable replacement ( {var.name} )
 */
exports.compile = function compile(a, b) {
  var compiler = null;
  var cfg = b.replace(/^([\s]+)/, '')
    .replace(/([\s]+)$/, '')
    .replace(/^(return)/i, '')
    .replace(/(;)$/, '');
  /*jshint evil:true */
  compiler = new Function('return !!(' + cfg + ');');

  return compiler();
};
