
var should = require('should');
var verdict = require('..');

/*global describe*/
/*global it*/

describe('Verdict Test', function() {
  var context = {};
  context.a = '1';
  context.b = '2';
  context.c = '3';
  context.d = '4';

  it('should parse a plain object into a nested ruleset', function() {
    var inner = {};
    var obj = {};
    inner.composite = 'any';
    inner.rules = [];
    inner.rules.push({ path: 'c', comparator: 'eq', value: '3' });
    inner.rules.push({ path: 'd', comparator: 'eq', value: '5' });
    obj.composite = 'all';
    obj.rules = [];
    obj.rules.push({ path: 'a', comparator: 'eq', value: '1' });
    obj.rules.push({ path: 'b', comparator: 'eq', value: '2' });
    obj.rules.push(inner);
    verdict()
      .parse(obj)
      .test(context)
      .should.equal(true);
  });

  it('should present a fluent interface correctly', function() {
    verdict().all()
      .eq('a', '1')
      .eq('b', '2')
      .test(context)
      .should.equal(true);

    verdict().all(
      verdict().any()
        .eq('a', '1')
        .eq('b', 'whatevs'),
      verdict().all()
        .eq('c', '3')
        .eq('d', '4')
    ).test(context)
      .should.equal(true);

    verdict().all(
        verdict().any()
          .eq('a', '1')
          .eq('b', 'whatevs'),
        verdict().all()
          .eq('c', '0')
          .eq('d', '4')
      ).test(context)
      .should.equal(false);
  });
});
