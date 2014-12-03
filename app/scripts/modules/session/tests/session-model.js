'use strict';

var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var CryptoJS = require('crypto-js');

chai.should();

var properFixture = require('./fixtures/successes');
var improperFixture = require('./fixtures/errors');

var Model = require('../models/session');

var setUpSuccessfulModel = function() {
  this.model = Model;

  this.model.set(properFixture.admin);
};

var setUpErroneousModel = function() {
  this.model = Model;

  this.model.set(improperFixture.defaults);
};

describe('defaults', function() {
  beforeEach(setUpSuccessfulModel);

  it('should have a gateway url', function() {
    this.model.get('gatewaydUrl').should.exist;
  });

  it('should have a session key', function() {
    this.model.get('sessionKey').should.exist;
  });

  it('should have a last login date/timestamp', function() {
    this.model.get('lastLogin').should.exist;
  });

  it('should have credentials', function() {
    this.model.get('credentials').should.exist;
  });
});

describe('valid model', function() {
  beforeEach(setUpSuccessfulModel);

  it('should be valid', function() {
    this.model.isValid().should.equal(true);
  });
});

describe('invalid model', function() {
  beforeEach(setUpErroneousModel);

  it('should be invalid', function() {
    this.model.isValid().should.equal(false);
  });
});

describe('updateSession', function() {
  beforeEach(setUpSuccessfulModel);

  it('should update the session', function() {
    var expected = {
      gatewaydUrl: 'www.passing.com',
      sessionKey: '1234'
    };
    var previousLastLogin = this.model.get('lastLogin');

    this.model.updateSession(expected.gatewaydUrl, expected.sessionKey);

    this.model.get('gatewaydUrl').should.equal(expected.gatewaydUrl);
    this.model.get('sessionKey').should.equal(expected.sessionKey);
    this.model.get('lastLogin').should.not.equal(previousLastLogin);
  });
});

describe('restore', function() {
  beforeEach(setUpSuccessfulModel);

  it('should restore the session', function() {

    // figure out how to mock session storage

    return true;
  });
});

describe('logout', function() {
  beforeEach(setUpSuccessfulModel);

  it('should log out', function() {

    // figure out how to mock session storage

    return true;
  });
});

describe('login', function() {
  beforeEach(setUpSuccessfulModel);

  it('should log in', function() {

    // figure out how to mock save response
    // figure out how to mock session storage

    return true;
  });
});

describe('createCredentials', function() {
  beforeEach(setUpSuccessfulModel);

  it('should create credentials', function() {
    var name = 'admin@example.com';
    var sessionKey = '1234';
    var expected = 'Basic ' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(name + ':' + sessionKey));

    this.model.createCredentials(name, sessionKey);

    this.model.get('credentials').should.equal(expected);
  });
});
