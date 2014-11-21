'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var AdminDispatcher = require('../../../dispatchers/admin-dispatcher');
var CryptoJS = require('crypto-js');
var sessionConfigActions = require('../config.json').actions;
var sessionActions = require('../actions.js');
var UserModel = require('../../../modules/users/models/user');

var Heartbeats = require('heartbeats');
var sessionHeart = new Heartbeats.Heart(60000); // 1 minute

Backbone.$ = $;

var Session = Backbone.Model.extend({
  defaults: {
    gatewaydUrl: '',
    sessionKey: '',
    lastLogin: 0,
    credentials: 'ABC' // Base64
  },

  requiredAttrs: {
    gatewaydUrl: {
      type: 'string',
      minLength: 1
    },
    sessionKey: {
      type: 'string',
      minLength: 1
    },
    lastLogin: {
      type: 'number' // milliseconds since 1970/01/01
    }
  },

  resetUserModel: function() {
    var defaults = this.get('userModel').defaults;

    this.get('userModel').set(defaults);

    return this.get('userModel');
  },

  initialize: function() {
    _.bindAll(this);

    this.set('userModel', new UserModel());

    AdminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction[sessionConfigActions.login] = this.login;
    handleAction[sessionConfigActions.logout] = this.logout;
    handleAction[sessionConfigActions.restore] = this.restore;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  validationErrors: [],

  handleObject: function(attr, minLength) {
    if (attr === null) {
      return false;
    }

    if (Array.isArray(attr)) {
      return attr.length >= minLength;
    }

    return Object.keys(attr).length >= minLength;
  },

  handleString: function(attr, minLength) {
    return !!attr && attr.length >= minLength;
  },

  testValid: function(attr, requirements) {
    var attribute = this.get(attr);
    var testValid = {
      object: this.handleObject,
      string: this.handleString,
    };
    var isDefined = !_.isUndefined(attribute);
    var type = requirements.type === 'array' ? 'object' : requirements.type;
    var isValid = typeof attribute === type;

    if (isValid && !_.isUndefined(testValid[typeof attribute])) {
      isValid = testValid[typeof attribute](attribute, requirements.minLength);
    }

    // custom error messaging
    if (!isDefined) {
      this.validationErrors.push('"' + attr + '" of session data is undefined');
    } else if (!isValid) {
      this.validationErrors.push('"' + attr + '" of session data is invalid');
    }

    return isDefined && isValid;
  },

  validate: function() {
    var isValid = true,
        _this = this;

    _.each(this.requiredAttrs, function(requirements, requiredAttr) {
      if (!_this.testValid(requiredAttr, requirements)) {
        isValid = false;
      }
    });

    if (!isValid) {
      return 'There is an error';
    }
  },

  updateSession: function(gatewaydUrl, sessionKey) {
    this.set({
      gatewaydUrl: gatewaydUrl,
      sessionKey: sessionKey,
      lastLogin: Date.now()
    });
  },

  updateUser: function(name) {
    this.get('userModel').set({
      name: name,
      role: name,
      isLoggedIn: true
    });
  },

  createCredentials: function(name, sessionKey) {
    var encodedString = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(name + ':' + sessionKey));

    this.set('credentials', 'Basic ' + encodedString);
  },

  login: function(payload) {
    var _this = this;

    this.updateSession(payload.gatewaydUrl, payload.sessionKey);
    this.updateUser(payload.name);
    this.createCredentials(payload.name, payload.sessionKey);

    this.save(null, {
      wait: true,
      url: this.get('gatewaydUrl') + '/v1/users/login',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.get('userModel').get('name') + '@example.com',
        password: this.get('sessionKey')
      }),
      headers: {
        'Authorization': this.get('credentials')
      },
      success: function() {
        sessionStorage.setItem('session', JSON.stringify(_this.toJSON()));

        // _this.setUpSessionTimer();

        sessionActions.updateBaseUrl(_this.get('gatewaydUrl'));
      }
    });
  },

  restore: function() {
    var oldSession = sessionStorage.length === 0 ? null : sessionStorage.getItem('session');

    if (oldSession) {
      var oldUser, restoredUser;

      this.set(JSON.parse(oldSession));
      oldUser = this.get('userModel');
      restoredUser = new UserModel(oldUser);
      this.set('userModel', restoredUser);
    }
  },

  logout: function() {
    var resetUser = this.resetUserModel();

    this.set(this.defaults);
    this.set('userModel', resetUser);

    sessionStorage.clear();
  },

  isLoggedIn: function() {
    return this.get('userModel').get('isLoggedIn');
  },

  getLogState: function() {
    var logState = {
      true: 'loggedIn',
      false: 'loggedOut'
    };

    return logState[this.isLoggedIn()];
  },

  setUpSessionTimer: function() {
    sessionHeart.onceOnBeat(10, function() { // 10 minutes
      sessionActions.logout();
    });
  },

  resetSessionTimer: function() {
    sessionHeart.clearEvents();
    this.setUpSessionTimer();
  }
});

module.exports = new Session();
