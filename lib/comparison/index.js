
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
exports.notInRange = function notInRange(a, b) {
  return a < b[0] || a > b[1];
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
