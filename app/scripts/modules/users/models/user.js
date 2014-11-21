'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var AdminDispatcher = require('../../../dispatchers/admin-dispatcher');
var user = require('../config.json');
Backbone.$ = $;

var User = Backbone.Model.extend({
  defaults: {
    name: 'guest',
    role: 'guest',
    isLoggedIn: false
  },

  requiredAttrs: {
    name: {
      type: 'string',
      minLength: 1
    },
    isLoggedIn: {
      type: 'boolean'
    }
  },

  initialize: function() {
    _.bindAll(this, 'testValid', 'validate');

    AdminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};
    handleAction[user.actions.login] = this.login;

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
  }
});

module.exports = User;
