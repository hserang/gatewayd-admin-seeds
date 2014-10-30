'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var Dispatcher = require('../../shared/dispatcher');
var CryptoJS = require('crypto-js')
Backbone.$ = $;

var WebfingerData = Backbone.Model.extend({
  defaults: {
    name: '',
    password: '',
    isLoggedIn: false
  },

  requiredAttrs: {
    name: {
      type: 'string',
      minLength: 1
    },
    password: {
      type: 'string',
      minLength: 1
    }
  },

  initialize: function() {
    _.bindAll(this, 'testValid', 'validate');

    Dispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {
      login: this.login
    };

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
      this.validationErrors.push('"' + attr + '" of user data is undefined');
    } else if (!isValid) {
      this.validationErrors.push('"' + attr + '" of user data is invalid');
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
    if (!payload.name || !payload.password) {
      return false;
    }

    var encodedString = CryptoJS.enc.Base64.stringify(payload.name + ':' + payload.password);
    var credentials = 'Basic ' + encodedString;
    var _this = this;

    this.fetch({
      type: 'POST',
      data: payload,
      headers: {
        'Authorization': credentials
      },
      success: function() {
        console.log('login SUCCESS', arguments);
        console.log('before', this.get('isLoggedIn'));
        _this.set({
          name: payload.name,
          password: payload.password,
          isLoggedIn: true
        });
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('lastLogin', new Date());
        console.log('after', this.get('isLoggedIn'));
      }
    });
  }

});

module.exports = WebfingerData;
