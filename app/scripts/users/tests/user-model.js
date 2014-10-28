var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

var properUser = require('./fixtures/successes');
var improperUser = require('./fixtures/errors');

var Model = require('../models/user');

var setUpSuccessfulModel = function() {
  this.model = new Model();

  this.model.set(properUser.admin);
};

var setUpErroneousModel = function() {
  this.model = new Model();

  this.model.set(improperUser.defaults);
};

describe('invalid model', function() {
  beforeEach(setUpErroneousModel);

  it('should determine if model data is invalid', function() {
    this.model.isValid().should.equal(false);
  });
});

describe('valid model', function() {
  beforeEach(setUpSuccessfulModel);

  it('should determine if model data is valid', function() {
    this.model.isValid().should.equal(true);
  });
});

describe('defaults', function() {
  beforeEach(setUpSuccessfulModel);

  it('should have a name', function() {
    this.model.get('name').should.exist;
  });

  it('should have a password', function() {
    this.model.get('password').should.exist;
  });

  it('should have a login status', function() {
    this.model.get('isLoggedIn').should.exist;
  });
});


