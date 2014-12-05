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

describe('invalid payment model', function() {
  beforeEach(setUpErroneousModel);

  it('should be invalid', function() {
    this.model.isValid().should.equal(false);
  });
});

describe('valid model', function() {
  beforeEach(setUpSuccessfulModel);

  it('should be valid', function() {
    this.model.isValid().should.equal(true);
  });
});

describe('defaults', function() {
  beforeEach(setUpSuccessfulModel);

  it('should have a to_address_id', function() {
    this.model.get('to_address_id').should.exist;
  });

  it('should have a from_address_id', function() {
    this.model.get('from_address_id').should.exist;
  });

  it('should have a to_amount', function() {
    this.model.get('to_amount').should.exist;
  });

  it('should have a to_currency', function() {
    this.model.get('to_currency').should.exist;
  });

  it('should have a to_issuer', function() {
    this.model.get('to_issuer').should.exist;
  });

  it('should have a from_amount', function() {
    this.model.get('from_amount').should.exist;
  });

  it('should have a from_currency', function() {
    this.model.get('from_currency').should.exist;
  });

  it('should have a from_issuer', function() {
    this.model.get('from_issuer').should.exist;
  });
});


