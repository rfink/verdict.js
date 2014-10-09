
var should = require('should');
var comparators = require('../lib/comparison');

/*global it*/
/*global describe*/

describe('Comparison test', function() {
  describe('Equals/Nequals', function() {
    it('should compare equals correctly, number same type', function() {
      comparators.eq(1, 1).should.equal(true);
    });
    it('should compare equals correctly, number different types', function() {
      comparators.eq(1, '1').should.equal(true);
    });
    it('should compare equals to be false correctly', function() {
      comparators.eq('one string', 'two string').should.equal(false);
    });
    it('should compare not equals correctly, number same type', function() {
      comparators.neq(1, 2).should.equal(true);
    });
    it('should compare not equals to be false correctly', function() {
      comparators.neq('1', 1).should.equal(false);
    });
  });

  describe('Identity/Negative Identity', function() {
    it('should compare identity true correctly', function() {
      comparators.is(1, 1).should.equal(true);
    });
    it('should compare identity false correctly, values', function() {
      comparators.is(1, 2).should.equal(false);
    });
    it('should compare identity false correctly, types', function() {
      comparators.is(1, '1').should.equal(false);
    });
    it('should compare negative identity true correctly', function() {
      comparators.not(1, 2).should.equal(true);
    });
    it('should compare negative identity false correctly, values', function() {
      comparators.not(1, 1).should.equal(false);
    });
  });

  describe('GT/LT/GTE/LTE', function() {
    it('should compare gt true correctly', function() {
      comparators.gt(1, 0).should.equal(true);
    });
    it('should compare gt false correctly', function() {
      comparators.gt(0, 1).should.equal(false);
    });
    it('should compare gte true correctly', function() {
      comparators.gte(1, 0).should.equal(true);
    });
    it('should compare gte false correctly', function() {
      comparators.gte(0, 1).should.equal(false);
    });
    it('should compare lt true correctly', function() {
      comparators.lt(0, 1).should.equal(true);
    });
    it('should compare lt false correctly', function() {
      comparators.lt(1, 0).should.equal(false);
    });
    it('should compare lte true correctly', function() {
      comparators.lte(0, 1).should.equal(true);
    });
    it('should compare lte false correctly', function() {
      comparators.lte(1, 0).should.equal(false);
    });
  });

  describe('Range/Negative Range', function() {
    it('should compare range true correctly', function() {
      comparators.inRange(3, [0, 4]).should.equal(true);
    });
    it('should compare range false correctly', function() {
      comparators.inRange(5, [0, 4]).should.equal(false);
    });
    it('should compare neg range true correctly', function() {
      comparators.ninRange(3, [4, 6]).should.equal(true);
    });
    it('should compare neg range false correctly', function() {
      comparators.ninRange(3, [0, 4]).should.equal(false);
    });
  });

  describe('Compiler', function() {
    it('should compare compile true correctly', function() {
      comparators.compile(null, '1 == 1').should.equal(true);
    });
    it('should compare compile false correctly', function() {
      comparators.compile(null, '1 == 2').should.equal(false);
    });
  });

  describe('RegEx/Negative RegEx', function() {
    it('should compare match true correctly', function() {
      comparators.matches('meh', /^meh$/).should.equal(true);
    });
    it('should compare match false correctly', function() {
      comparators.matches('beh', /merf/).should.equal(false);
    });
    it('should compare neg match true correctly', function() {
      comparators.nmatches('meh', /merf/).should.equal(true);
    });
    it('should compare neg match false correctly', function() {
      comparators.nmatches('beh', /^beh$/).should.equal(false);
    });
  });

  describe('Contains/NContains', function() {
    it('should compare contains true correctly', function() {
      comparators.contains('meh', 'eh').should.equal(true);
    });
    it('should compare contains false correctly', function() {
      comparators.contains('beh', 'meh').should.equal(false);
    });
    it('should compare neg contains true correctly', function() {
      comparators.ncontains('meh', 'b').should.equal(true);
    });
    it('should compare neg contains false correctly', function() {
      comparators.ncontains('beh', 'eh').should.equal(false);
    });
  });

  describe('DivisibleBy/NDivisibleBy', function() {
    it('should compare divisbleBy true correctly', function() {
      comparators.divisibleBy(9, 3).should.equal(true);
    });
    it('should compare divisibleBy false correctly', function() {
      comparators.divisibleBy(9, 4).should.equal(false);
    });
    it('should compare ndivisbleBy true correctly', function() {
      comparators.ndivisibleBy(9, 4).should.equal(true);
    });
    it('should compare ndivisibleBy false correctly', function() {
      comparators.ndivisibleBy(9, 3).should.equal(false);
    });
  });

  describe('Weighted/NWeighted', function() {
    it('should weighted true correctly', function() {
      comparators.weight(null, 1).should.equal(true);
    });
    it('should weighted false correctly', function() {
      comparators.weight(null, 0).should.equal(false);
    });
    it('should nweighted true correctly', function() {
      comparators.nweight(null, 0).should.equal(true);
    });
    it('should nweighted false correctly', function() {
      comparators.nweight(null, 1).should.equal(false);
    });
  });
});
