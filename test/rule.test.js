
var should = require('should');
var rule = require('../lib/rule');

/*global describe*/
/*global it*/

describe('Rule test', function() {
  var context = {};
  context.a = {};
  context.a.b = {};
  context.a.b.prop1 = '5';

  it('should compile a rule correctly', function() {
    var payload = {};
    var theRule;
    payload.path = 'a.b.prop1';
    payload.comparator = 'eq';
    payload.value = '5';
    theRule = rule(payload);
    theRule.test(context).should.equal(true);
  });

  it('should compile a rule (inverted) correctly', function() {
    var payload = {};
    var theRule;
    payload.path = 'a.b.prop1';
    payload.comparator = 'eq';
    payload.value = '5';
    payload.invert = true;
    theRule = rule(payload);
    theRule.test(context).should.equal(false);
  });

  it('should compile a rule with a missing context property', function() {
    var payload = {};
    var theRule;
    payload.path = 'a.b.doesNotExist';
    payload.comparator = 'contains';
    payload.value = 'wat';
    theRule = rule(payload);
    theRule.test(context).should.equal(false);
  });
});
