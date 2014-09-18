
/**
 * Check if any of the given rules are valid
 */
exports.any = function any(rules, context) {
  var i = null;
  var len = null;

  if (!rules) {
    return false;
  }

  for (i = 0, len = rules.length; i < len; ++i) {
    if (rules[i].test(context)) {
      return true;
    }
  }

  return false;
};

/**
 * Check if all of the given rules are valid
 */
exports.all = function all(rules, context) {
  var i = null;
  var len = null;

  if (!rules) {
    return false;
  }

  for (i = 0, len = rules.length; i < len; ++i) {
    if (!rules[i].test(context)) {
      return false;
    }
  }

  return true;
};

/**
 * Check if none of the rules are valid
 */
exports.none = function none(rules, context) {
  return !exports.any.apply(null, arguments);
};
