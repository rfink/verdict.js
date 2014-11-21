!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.verdict=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var weighted = require('weighted');

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

},{"weighted":6}],2:[function(require,module,exports){

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

},{}],3:[function(require,module,exports){
var Rule = require('./rule');
var composites = require('./composite');
var comparators = require('./comparison');
var key;

module.exports = Ruleset;

/**
 * Construct a new ruleset
 */
function Ruleset(rules, composite) {
  if (!(this instanceof Ruleset)) {
    return new Ruleset(rules, composite);
  }
  this.composite = composite || 'all';
  this.rules = rules || [];
}

// Inherit from Rule
Ruleset.prototype = new Rule();
Ruleset.prototype.constructor = Ruleset;

/**
 * Test the rulesets for truthiness
 */
Ruleset.prototype.test = function test(context) {
  var composite = composites[this.composite];
  if (!composite) {
    throw new Error('Invalid composite or no composite supplied');
  }
  return composite.call(null, this.rules, context);
};

/**
 * Add a rule(s) to our ruleset
 */
Ruleset.prototype.add = function add(rule) {
  var i = null;
  var len = null;

  if (rule instanceof Array) {
    for (i = 0, len = rule.length; i < len; ++i) {
      this.add(rule[i]);
    }
    return this;
  }

  if (rule instanceof Rule) {
    this.rules.push(rule);
  } else {
    if (rule.rules) {
      this.rules.push(new Ruleset(rule.rules, rule.composite));
    } else {
      this.rules.push(new Rule(rule));
    }
  }

  return this;
};

/**
 * Turn the given JSON object into a verdict
 */
Ruleset.prototype.parse =
Ruleset.parse = function parse(json) {
  var obj = null;
  var i = null;
  var len = null;

  if (!json) {
    throw new Error('JSON cannot be empty');
  }

  if (!json.rules) {
    return new Rule(json);
  }

  obj = new Ruleset();
  obj.composite = json.composite || obj.composite;

  for (i = 0, len = json.rules.length; i < len; ++i) {
    obj.rules.push(parse(json.rules[i]));
  }

  return obj;
};

function addComparator(key) {
  return function(path, value) {
    this.rules.push(new Rule({ path: path, comparator: key, value: value }));
    return this;
  };
}

function addComposite(key) {
  return function(rules) {
    var args = Array.prototype.slice.call(arguments);
    if (args[0] instanceof Array) {
      args = args[0];
    }
    if (args) {
      this.add(args);
    }
    this.composite = key;
    return this;
  };
}

for (key in composites) {
  if (!composites.hasOwnProperty(key)) {
    continue;
  }
  Ruleset.prototype[key] = addComposite(key);
}

for (key in comparators) {
  if (!comparators.hasOwnProperty(key)) {
    continue;
  }
  Ruleset.prototype[key] = addComparator(key);
}

},{"./comparison":1,"./composite":2,"./rule":4}],4:[function(require,module,exports){
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
  var val = selectn(this.path, context) || '';
  var comparator = comparators[this.comparator];

  if (!comparator) {
    throw new Error('Invalid comparator or comparator not supplied');
  }

  return !!(comparator.call(null, val, this.value) ^ this.invert);
};

},{"./comparison":1,"selectn":5}],5:[function(require,module,exports){

// expose `selectn`

module.exports = selectn;

/**
 * Select n-levels deep into an object given a dot/bracket-notation query.
 * If partially applied, returns a function accepting the second argument.
 *
 * ### Examples:
 *
 *      selectn('name.first', contact);
 *
 *      selectn('addresses[0].street', contact);
 *
 *      contacts.map(selectn('name.first'));
 *
 * @param  {String} query
 * dot/bracket-notation query string
 *
 * @param  {Object} object
 * object to access
 *
 * @return {Function}
 * accessor function that accepts an object to be queried
 */

function selectn(query) {
  var parts;

  // normalize query to `.property` access (i.e. `a.b[0]` becomes `a.b.0`)
  query = query.replace(/\[(\d+)\]/g, '.$1');
  parts = query.split('.');

  /**
   * Accessor function that accepts an object to be queried
   *
   * @private
   *
   * @param  {Object} object
   * object to access
   *
   * @return {Mixed}
   * value at given reference or undefined if it does not exist
   */

  function accessor(object) {
    var ref = object || (1, eval)('this');
    var len = parts.length;
    var idx = 0;

    // iteratively save each segment's reference
    for (; idx < len; idx += 1) {
      if (ref) ref = ref[parts[idx]];
    }

    return ref;
  }

  // curry accessor function allowing partial application
  return arguments.length > 1
       ? accessor(arguments[1]) 
       : accessor;
}


},{}],6:[function(require,module,exports){
module.exports = require('./lib/weighted')

},{"./lib/weighted":7}],7:[function(require,module,exports){
function getTotal(weights) {
  var total = weights.__weighted_total

  if (total != null) {
    return total
  }

  function wrap(arr, fn) {
    return function () {
      arr.__weighted_total = null
      fn.apply(arr, arguments)
    }
  }

  if (total === undefined) {
    ;['pop', 'push', 'shift', 'unshift', 'splice'].forEach(function (key) {
      weights[key] = wrap(weights, weights[key])
    })
  }

  total = weights.__weighted_total = weights.reduce(function (prev, curr) {
    return prev + curr
  }, 0)

  return total
}

function _selectArr(set, weights, options) {
  if (typeof options.rand !== 'function') {
    options.rand = Math.random
  }

  if (set.length !== weights.length) {
    throw new Error('Different number of options & weights.')
  }

  var total = options.total || (options.normal ? 1 : getTotal(weights))
    , key = options.rand() * total
    , index = 0

  for (;index < weights.length; index++) {
    key -= weights[index]

    if (key < 0) {
      return set[index]
    }
  }

  throw new Error('All weights do not add up to >= 1 as expected.')
}

function _selectObj(obj, options) {
  var keys = Object.keys(obj)
    , values = keys.map(function (key) {
        return obj[key]
      })

  return _selectArr(keys, values, options)
}

function select(set, weights, options) {
  if (typeof options === 'function') {
    options = {
      rand: options
    }
  }

  if (options == null) {
    options = {}
  }

  if (Array.isArray(set)) {
    if (Array.isArray(weights)) {
      if (set.length === weights.length) {
        return _selectArr(set, weights, options)
      }

      throw new Error('Set and Weights are different sizes.')
    }

    throw new Error('Set is an Array, and Weights is not.')
  }

  if (typeof set === 'object') {
    return _selectObj(set, weights || options)
  }

  throw new Error('Set is not an Object, nor is it an Array.')
}

module.exports = select
module.exports.select = select

},{}]},{},[3])(3)
});