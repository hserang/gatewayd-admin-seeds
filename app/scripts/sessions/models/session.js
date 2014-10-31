'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var Dispatcher = require('../../shared/dispatcher');
var CryptoJS = require('crypto-js');
var session = require('../config.json');
Backbone.$ = $;

var realuserModel = require('../../users/models/user');

var User = Backbone.Model.extend({
  initialize: function() {
    this.set('isLoggedIn', false);
  }
});

var Session = Backbone.Model.extend({
  defaults: {
    sessionKey: '',
    lastLogin: 0,
  },

  requiredAttrs: {
    sessionKey: {
      type: 'string',
      minLength: 1
    },
    lastLogin: {
      type: 'number' // milliseconds since 1970/01/01
    }
  },

  url: 'http://localhost:5000/v1/users/login',

  initialize: function() {
    _.bindAll(this, 'dispatchCallback', 'testValid', 'validate', 'login');

    this.set('userModel', new User({name: 'admin'}));

    Dispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};
    handleAction[session.actions.login] = this.login;

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

  login: function(payload) {
    if (!payload.name || !payload.sessionKey) {
      return false;
    }

    var encodedString = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(payload.name + ':' + payload.sessionKey));
    var credentials = 'Basic ' + encodedString;
    var _this = this;

    console.log('gets this far', encodedString);

    this.fetch({
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        name: payload.name,
        password: payload.sessionKey
      }),
      headers: {
        'Authorization': credentials
      },
      // success: function() {
      //   console.log('login SUCCESS', arguments);

      //   _this.set({
      //     sessionKey: payload.sessionKey,
      //     lastLogin: Date.now()
      //   });

      //   _this.get('userModel').set({
      //     name: payload.name,
      //     isLoggedIn: true
      //   });

      //   sessionStorage.setItem('session', _this);
      // }
    });
  },

  isLoggedIn: function(user) {
    return user.get('isLoggedIn');
  },

  isExpired: function() {
    return Date.now() - this.get('lastLogin') > 3600000; // 1 hour
  }

});

module.exports = Session;
