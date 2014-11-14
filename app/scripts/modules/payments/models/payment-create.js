'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var RippleName = require('ripple-name');
var dispatcher = require('../../../dispatchers/admin-dispatcher');
var session = require('../../session/models/session');
var paymentActions = require('../config.json').actions;
Backbone.$ = $;

var Payment = Backbone.Model.extend({
  defaults: {
    address: '',
    amount: 0,
    currency: '',
    destinationTag: 0,
    sourceTag: 0, // not implemented yet
    invoiceId: '', // not implemented yet
    memo: '' // not implemented yet
  },

  requiredAttrs: {
    address: {
      type: 'string',
      minLength: 1, // some min for ripple address, but none for ripple name
      isRequired: true
    },
    amount: {
      type: 'number', // decimal,
      isRequired: true
    },
    currency: {
      type: 'string',
      minLength: 1,
      isRequired: true
    }
  },

  validationRules: {
    address: {
      type: 'string',
      minLength: 1, // some min for ripple address, but none for ripple name
      isRequired: true
    },
    amount: {
      type: 'number', // decimal,
      isRequired: true
    },
    currency: {
      type: 'string',
      minLength: 1,
      isRequired: true
    },
    destinationTag: {
      type: 'number',
      isRequired: false
    },
    sourceTag: {
      type: 'number',
      isRequired: false
    },
    invoiceId: {
      type: 'string',
      minLength: 1,
      isRequired: false
    },
    memo: {
      type: 'string',
      minLength: 1,
      isRequired: false
    }
  },

  url: "http://localhost:5000/v1/payments/outgoing",

  initialize: function() {
    _.bindAll(this);

    dispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction[paymentActions.sendPaymentAttempt] = this.sendPaymentAttempt;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  validationErrors: [],

  handleObject: function(value, minLength) {
    if (value === null) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length >= minLength;
    }

    return Object.keys(value).length >= minLength;
  },

  handleString: function(value, minLength) {
    return !!value && value.length >= minLength;
  },

  testValid: function(value, attr, rules) {
    if (value === null && !rules[attr].isRequired) {
      return true;
    }

    var testValid = {
      object: this.handleObject,
      string: this.handleString,
    };
    var isDefined = !_.isUndefined(value);
    var type = rules[attr].type === 'array' ? 'object' : rules[attr].type;
    var isValid = typeof value === 'number' ? !isNaN(value) : typeof value === type;

    if (isValid && !_.isUndefined(testValid[typeof value])) {
      isValid = testValid[typeof value](value, rules[attr].minLength);
    }

    // custom error messaging
    if (!isDefined) {
      this.validationErrors.push(attr + ' is undefined');
    } else if (!isValid) {
      this.validationErrors.push(attr + ' is invalid');
    }

    return isDefined && isValid;
  },

  validate: function(attributes) {
    var isValid = true,
        _this = this;

    this.validationErrors = [];

    _.each(attributes, function(value, attr) {
      if (_.isUndefined(_this.validationRules[attr])) {
        return true;
      }

      if (!_this.testValid(value, attr, _this.validationRules)) {
        isValid = false;
      }
    });

    if (!isValid) {
      return this.validationErrors.join(', ');
    }
  },

  postPayment: function() {
    var _this = this;

    this.save(null, {
      contentType: 'application/json',
      headers: {
        Authorization: session.get('credentials')
      }
    });
  },

  sendPaymentAttempt: function(payment) {
    var _this = this;

    this.clear({silent: true});
    this.set(payment, {validate: true});

    RippleName.lookup(payment.address)
    .then(function(data) {
      if (data.exists) {
        _this.set('address', data.address);

        _this.postPayment();
      } else {
        console.log('ripple/name address is NOT ok');
        _this.set({address: ''}, {validate: true});
      }
    })
    .error(function() {
      console.log('ripple name lookup is broke');
      _this.set({address: ''}, {validate: true});
    });
  },

  handleFieldValidation: function(validationResult, fieldRef) {
    if (!_.isUndefined(validationResult)) {
      this.trigger('validationComplete', false, fieldRef, validationResult);
    } else {
      this.trigger('validationComplete', true, fieldRef, '');
    }
  },

  validateAddress: function(address) {
    if (address === null) {
      return false;
    }

    var _this = this;
    RippleName.lookup(address)
    .then(function(data) {
      if (data.exists) {
        var addressAttr = {
          address: data.address
        };

        _this.set(addressAttr);
        _this.handleFieldValidation(_this.validate(addressAttr), 'address');
      } else {
        _this.trigger('validationComplete', false, 'address', 'ripple name does not exist');
      }
    })
    .error(function() {
      _this.trigger('validationComplete', false, 'address', 'ripple name lookup failed');
    });
  },

  validateField: function(fieldName, fieldValue) {
    if (fieldValue === null) {
      return false;
    }

    var updatedField = {};
    updatedField[fieldName] = fieldValue;

    this.set(updatedField);

    this.handleFieldValidation(this.validate(updatedField), fieldName);
  }
});

module.exports = Payment;
