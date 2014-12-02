'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var AdminDispatcher = require('../../../dispatchers/admin-dispatcher');
var CryptoJS = require('crypto-js');
var sessionConfigActions = require('../config.json').actions;
var sessionActions = require('../actions.js');
var UserModel = require('../../../modules/users/models/user');

Backbone.$ = $;

var Session = Backbone.Model.extend({
  defaults: {
    gatewaydUrl: '',
    sessionKey: '',
    lastLogin: 0,
    credentials: 'ABC' // Base64
  },

  validationRules: {
    gatewaydUrl: {
      type: 'string',
      minLength: 1,
      isRequired: true
    },
    sessionKey: {
      type: 'string',
      minLength: 1,
      isRequired: true
    },
    lastLogin: {
      type: 'number', // milliseconds since 1970/01/01
      isRequired: true
    },
    credentials: {
      type: 'string',
      minLength: 1,
      isRequired: true
    }
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

  testValid: function(value, attr, rules) {
    if (_.isNull(value) && !rules[attr].isRequired) {
      return true;
    } else if (_.isUndefined(value)) {
      this.validationErrors.push(attr + ' is undefined');

      return false;
    }

    var isValid = false;
    var minLength = rules[attr].minLength;

    if (typeof value === 'number') {
      isValid = !isNaN(value);
    } else if (typeof value === 'string') {
      isValid = !_.isEmpty(value) && value.length >= minLength;
    } else if (_.isArray(value)) {
      isValid = value.length >= minLength;
    } else if (typeof value === 'object') {
      isValid = !_.isNull(value) && _.keys(value).length >= minLength;
    }

    if (!isValid) {
      this.validationErrors.push(attr + ' is invalid');
    }

    return isValid;
  },

  validate: function(attributes) {
    var _this = this;

    this.validationErrors = [];

    var isValid = _.reduce(attributes, function(accumulator, value, attr) {
      if (_.isUndefined(_this.validationRules[attr])) {
        return accumulator && true;
      }

      if (_this.testValid(value, attr, _this.validationRules)) {
        return accumulator && true;
      }

      return false;
    }, true);


    if (!Object.keys(attributes).length) {
      isValid = false;
    }

    if (!isValid) {
      return this.validationErrors.join(', ');
    }
  },

  // isValid: function() {
  //   this.validate(this.attributes);

  //   return !this.validationError;
  // },

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
      role: name.split('@')[0],
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
    this.get('userModel').update(payload.name);
    this.createCredentials(payload.name, payload.sessionKey);

    this.save(null, {
      wait: true,
      url: this.get('gatewaydUrl') + '/v1/users/login',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.get('userModel').get('name'),
        password: this.get('sessionKey')
      }),
      headers: {
        'Authorization': this.get('credentials')
      }
    })
    .then(function() {
      sessionStorage.setItem('session', JSON.stringify(_this.toJSON()));
    });
  },

  restore: function() {
    var oldSession, oldUser, restoredUser;

    if (sessionStorage.length === 0) {
      return;
    }

    oldSession = sessionStorage.getItem('session');

    this.set(JSON.parse(oldSession));
    oldUser = this.get('userModel');
    restoredUser = new UserModel(oldUser);
    this.set('userModel', restoredUser);
  },

  logout: function() {
    var resetUser;

    this.get('userModel').reset();
    resetUser = this.get('userModel');

    this.set(this.defaults);
    this.set('userModel', resetUser);

    sessionStorage.clear();
    this.trigger('logout');
  },

  isLoggedIn: function() {
    return this.get('userModel').get('isLoggedIn');
  },

  getLogState: function() {
    var logStateMap = {
      true: 'loggedIn',
      false: 'loggedOut'
    };

    return logStateMap[this.isLoggedIn()];
  }
});

module.exports = new Session();
