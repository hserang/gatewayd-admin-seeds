'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var dispatcher = require('../../dispatchers/admin-dispatcher');
var payment = require('../config.json');
Backbone.$ = $;

var Payment = Backbone.Model.extend({
  defaults: {
    to_address_id: 0,
    from_address_id: 0,
    to_amount: 0.0,
    to_currency: '',
    to_issuer: '',
    from_amount: 0.0,
    from_currency: '',
    from_issuer: '',
    transaction_state: '',
    transaction_hash: '',
    data: '',
    state: '',
    external_transaction_id: 0
  },

  requiredAttrs: {
    to_address_id: {
      type: 'number' // int
    },
    from_address_id: {
      type: 'number' // int
    },
    to_amount: {
      type: 'number' // decimal
    },
    to_currency: {
      type: 'string',
      minLength: 1
    },
    to_issuer: {
      type: 'string',
      minLength: 1 // figure out what this is!!!!!
    },
    from_amount: {
      type: 'number' // decimal
    },
    from_currency: {
      type: 'string',
      minLength: 1
    },
    from_issuer: {
      type: 'string',
      minLength: 1 // figure out what this is!!!!!
    }
  },

  initialize: function() {
    _.bindAll(this, 'testValid', 'validate');

    dispatcher.register(this.dispatchCallback);
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
      this.validationErrors.push('"' + attr + '" of payment is undefined');
    } else if (!isValid) {
      this.validationErrors.push('"' + attr + '" of payment is invalid');
    }

    //return isDefined && isValid;
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

module.exports = Payment;
