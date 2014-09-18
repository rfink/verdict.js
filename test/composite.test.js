
var should = require('should');
var ruleset = require('..');

/*global describe*/
/*global it*/

describe('Composite test', function() {
  var context = {};
  context.a = '1';
  context.b = '2';
  context.c = '3';

  it('should do "all" true correctly', function() {
    ruleset()
      .add({ path: 'a', comparator: 'eq', value: '1' })
      .add({ path: 'b', comparator: 'eq', value: '2' })
      .add({ path: 'c', comparator: 'eq', value: '3' })
      .test(context).should.equal(true);
  });

  it('should do "all" false correctly', function() {
    ruleset()
      .add({ path: 'a', comparator: 'eq', value: '1' })
      .add({ path: 'b', comparator: 'eq', value: '2' })
      .add({ path: 'c', comparator: 'eq', value: '4' })
      .test(context).should.equal(false);
  });

  it('should do "any" true correctly', function() {
    ruleset(null, 'any')
      .add({ path: 'a', comparator: 'eq', value: '1' })
      .add({ path: 'b', comparator: 'eq', value: '3' })
      .add({ path: 'c', comparator: 'eq', value: '4' })
      .test(context).should.equal(true);
  });

  it('should do "any" false correctly', function() {
    ruleset(null, 'any')
      .add({ path: 'a', comparator: 'eq', value: '0' })
      .add({ path: 'b', comparator: 'eq', value: '0' })
      .add({ path: 'c', comparator: 'eq', value: '0' })
      .test(context).should.equal(false);
  });

  it('should do "none" true correctly', function() {
    ruleset(null, 'none')
      .add({ path: 'a', comparator: 'eq', value: '0' })
      .add({ path: 'b', comparator: 'eq', value: '0' })
      .add({ path: 'c', comparator: 'eq', value: '0' })
      .test(context).should.equal(true);
  });

  it('should do "none" false correctly', function() {
    ruleset(null, 'none')
      .add({ path: 'a', comparator: 'eq', value: '1' })
      .add({ path: 'b', comparator: 'eq', value: '0' })
      .add({ path: 'c', comparator: 'eq', value: '0' })
      .test(context).should.equal(false);
  });
});
