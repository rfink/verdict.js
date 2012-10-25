/* - Bootstrap our dependencies - */
var verdict = require('verdict');
var async = require('async');

exports = module.exports = DecisionTree;

/**
 * Abstract decision tree constructor.
 * @param  {verdict.comparisonInterface} (internal)
 * @return {DecisionTree}
 */
function DecisionTree(Condition, debug) {
    this.children = [];
    this.segmentName = null;
    this.segmentId = null;
    this.Condition = Condition;
    this.debug = debug || {
        events: []
    };
}

/**
 * Evaluate our condition and pass the result into the callback
 * @param  {Function} callback
 * @return {mixed}
 */
DecisionTree.prototype.evaluateCondition = function(callback) {
    if (this.Condition === null || typeof this.Condition === 'undefined') return callback(null, true);
    this.Condition.evaluate(function(err, pass) {
        if (err) return callback(err);
        return callback(null, pass);
    });
};

/**
 * Evaluate our conditions and return the correct leaf node
 * @param  {Function} cb
 * @return {object}
 */
DecisionTree.prototype.getLeafNode = function(cb) {
    var path = [];
    return (function getLeaf(callback, self) {
        self.debug.events.push({
            event: 'Evaluated segment (' + this.nodeName + ')'
        });
        self.evaluateCondition(function(err, pass) {
            if (err) return callback(err);
            if (!pass) return callback(null, false);
            path.push(self);
            if (self.isLeafNode()) {
                path.shift();
                return callback(null, {path: path, node: self});
            }
            async.detectSeries(self.children, function(child, iteratorCallback) {
                getLeaf(function(err, result) {
                    if (err) return callback(err);
                    if (result) {
                        iteratorCallback(true);
                        callback(null, result);
                    } else {
                        iteratorCallback(false);
                    }
                }, child);
            },
            function(res) {
                if (typeof res === 'undefined') {
                    self.debug.events.push({
                        event: 'Branch evaluated to false'
                    });
                    path.pop();
                    callback(null, null);
                }
            });
        });
    })(cb, this);
};

/**
 * Check if we are a leaf node
 * @return {boolean}
 */
DecisionTree.prototype.isLeafNode = function() {
    return !(this.children.length);
};

/**
 * Get all of our leaf nodes and return as a stack
 * @return {array}
 */
DecisionTree.prototype.getAllLeaves = function() {
    var lts = [];
    this.forEach(function(node) {
        // TODO: Different way to test if is child
        if (node.testRoundId) lts.push(node);
    });
    return lts;
};

/**
 * Enumerate all nodes in our tree
 * @return {integer}
 */
DecisionTree.prototype.enumerate = function() {
    var counter = 1;
    this.forEach(function(node) {
        node.segmentId = counter++;
    });
    return counter - 1;
};

/**
 * Iterate our node recursively and apply the given callback to each
 * @param {Function} callback
 * @return {void}
 */
DecisionTree.prototype.forEach = function(callback) {
    callback.call(this, this);
    this.children.forEach(function(child) {
        child.forEach(callback);
    });
};

/**
 * Copy (recursively) our tree and return
 * @return {DecisionTree}
 */
DecisionTree.prototype.copy = function() {
    var T = new this.constructor;
    T.Condition = this.Condition;
    this.children.forEach(function(child) {
        T.children.push(child.copy());
    });
    return T;
};

/**
 * Walk our tree and apply a function to each, passing in a storage array
 * @param  {Function} callback
 * @param  {array} arr
 * @return {array}
 */
DecisionTree.prototype.reduce = function(callback, arr) {
    arr = arr || [];
    callback(this, arr);
    this.children.forEach(function(child) {
        child.reduce(callback, arr);
    });
    return arr;
};

/**
 * Get the sql to our path that evaluates to true (passing the result into the callback)
 * @param  {Function} callback
 * @return {string}
 */
DecisionTree.prototype.getPathSql = function(callback) {
    this.getLeafNode(function(err, obj) {
        if (err) return callback(err);
        var sqlArr = [];
        obj.path.forEach(function(node) {
            sqlArr.push(node.Condition.toSql());
        });
        return callback(null, sqlArr.join(' AND '));
    });
};

/**
 * Get our mongo query document for the path that evaluates to true
 * @param  {Function} callback
 * @return {object}
 */
DecisionTree.prototype.getPathMongoQuery = function(callback) {
    this.getLeafNode(function(err, obj) {
        if (err) return callback(err);
        var andObj = {};
        obj.path.forEach(function(node) {
            _(andObj).extend(node.Condition.toMongoQuery());
        });
        return callback(null, andObj);
    });
};

/**
 * Do a breadth first traversal of our tree and push the results onto a stack, and return
 * @return {array}
 */
DecisionTree.prototype.breadthFirstToArray = function() {
    var rarr = [], arr = [];
    arr.push(this);
    while (arr.length) {
        var S = arr.shift();
        rarr.push(S);
        S.children.forEach(function(child) {
            arr.push(child);
        });
    }
    return rarr;
};

/**
 * Static creator method
 * @param  {object} dataObject
 * @param  {object} contextObject
 * @return {DecisionTree}
 */
DecisionTree.factory = function(dataObject, contextObject) {
    var Dec = new DecisionTree(verdict.factory(contextObject, dataObject.Condition));
    Dec.segmentName = dataObject.segmentName;
    if (dataObject.segmentId) Dec.segmentId = dataObject.segmentId;
    // Recurse with factory, if needed
    if (dataObject.children) {
        dataObject.children.forEach(function(child) {
            Dec.children.push(DecisionTree.factory(child, contextObject));
        });
    }
    return Dec;
};