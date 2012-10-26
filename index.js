var verdict = exports = module.exports = {};

// Attach our submodules to be exported
verdict.comparison = require('./src/comparison');
verdict.composite = require('./src/composite');
verdict.util = require('./src/util');
verdict.Context = require('./src/context');
verdict.DecisionTree = require('./src/decisiontree');
verdict.ContextProperty = require('./src/contextproperty');
verdict.ComparisonParameter = require('./src/comparisonparameter');

