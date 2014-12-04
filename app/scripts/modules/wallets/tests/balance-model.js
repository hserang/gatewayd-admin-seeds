var chai = require('chai');
var should = chai.should();
var properFixture = require('./fixtures/successes');
var improperFixture = require('./fixtures/errors');

var Model = require('../models/balance');

var setUpSuccessfulModel = function() {
  this.model = new Model();

  this.model.set(properFixture.admin);
};

var setUpErroneousModel = function() {
  this.model = new Model();

  this.model.set(improperFixture).defaults;
};

describe('Balance Model:', function() {
  describe('validation', function() {
    describe('should pass when isValid', function() {
      beforeEach(setUpSuccessfulModel);

      it('is true', function() {
        this.model.isValid().should.equal(true);
      });
    });

    describe('should fail when isValid', function() {
      beforeEach(setUpErroneousModel);

      it('is false', function() {
        this.model.isValid().should.equal(false);
      });
    });
  });


  describe('should have required attributes:', function() {
    beforeEach(setUpSuccessfulModel);

    it('has value', function() {
      this.model.get('value').should.exist;
    });

    it('has currency', function() {
      this.model.get('currency').should.exist;
    });
  });
});
