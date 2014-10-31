var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

var properFixture = require('./fixtures/successes');
var improperFixture = require('./fixtures/errors');

var Model = require('../models/session');
var SubModel = require('../../users/models/user'); // what to do with this?

var setUpSuccessfulModel = function() {
  this.model = new Model();

  this.model.set(properFixture.admin);
};

var setUpErroneousModel = function() {
  this.model = new Model();

  this.model.set(improperFixture.defaults);
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

  it('should have a session key', function() {
    this.model.get('sessionKey').should.exist;
  });

  it('should have a last login date/timestamp', function() {
    this.model.get('lastLogin').should.exist;
  });
});


