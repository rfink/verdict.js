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
