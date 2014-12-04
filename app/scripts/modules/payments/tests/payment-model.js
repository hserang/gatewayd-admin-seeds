var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

var properPayment = require('./fixtures/successes');
var improperPayment = require('./fixtures/errors');

var Model = require('../models/payment');

var setUpSuccessfulModel = function() {
  this.model = new Model();

  this.model.set(properPayment.bob);
};

var setUpErroneousModel = function() {
  this.model = new Model();

  this.model.set(improperPayment.defaults);
};

describe('Payment Model:', function() {
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

    it('has to_address_id', function() {
      this.model.get('to_address_id').should.exist;
    });

    it('has from_address_id', function() {
      this.model.get('from_address_id').should.exist;
    });

    it('has to_amount', function() {
      this.model.get('to_amount').should.exist;
    });

    it('has to_currency', function() {
      this.model.get('to_currency').should.exist;
    });

    it('has to_issuer', function() {
      this.model.get('to_issuer').should.exist;
    });

    it('has from_amount', function() {
      this.model.get('from_amount').should.exist;
    });

    it('has from_currency', function() {
      this.model.get('from_currency').should.exist;
    });

    it('has from_issuer', function() {
      this.model.get('from_issuer').should.exist;
    });
  });
});





