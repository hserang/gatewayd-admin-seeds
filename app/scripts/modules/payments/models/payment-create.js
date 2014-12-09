"use strict";

var _ = require('lodash');
var $ = require('jquery');
var RippleName = require('ripple-name');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var paymentConfigActions = require('../config.json').actions;
var session = require('../../session/models/session');

Backbone.$ = $;

var Payment = Backbone.Model.extend({
  defaults: {
    address: '',
    amount: 0,
    currency: '',
    destinationTag: 0,
    sourceTag: 0,
    invoiceId: '',
    memo: ''
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

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction[paymentConfigActions.sendPaymentAttempt] = this.sendPaymentAttempt;

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

    if (!isDefined) {
      this.validationErrors.push(attr + ' is undefined');
    } else if (!isValid) {
      this.validationErrors.push(attr + ' is invalid');
    }

    return isDefined && isValid;
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
      } else {
        return false;
      }
    }, true);

    if (!Object.keys(attributes).length) {
      isValid = false;
    }

    if (!isValid) {
      return this.validationErrors.join(', ');
    }
  },

  isValid: function() {
    this.validate(this.attributes);

    return !this.validationError;
  },

  postPayment: function() {
    this.save(null, {
      url: session.get('gatewaydUrl') + '/v1/payments/outgoing',
      contentType: 'application/json',
      headers: {
        Authorization: session.get('credentials')
      }
    });
  },

  sendPaymentAttempt: function(payment) {
    this.validateAddress(payment.address);

    if (this.isValid()) {
      this.postPayment();
    }
  },

  handleFieldValidation: function(validationResult, fieldRef) {
    if (!_.isUndefined(validationResult)) {
      this.trigger('validationComplete', false, fieldRef, validationResult);
    } else {
      this.trigger('validationComplete', true, fieldRef, '');
    }
  },

  validateAddress: function(address) {
    var _this = this;

    RippleName.lookup(address)
    .then(function(data) {
      var addressAttr;

      if (data.exists) {
        addressAttr = {
          address: data.address
        };

        _this.set(addressAttr);
        _this.handleFieldValidation(_this.validate(addressAttr), 'address');
      } else {
        _this.trigger('validationComplete', false, 'address', 'ripple name/address does not exist');
      }
    })
    .error(function() {
      _this.trigger('validationComplete', false, 'address', 'ripple name lookup failed');
    });
  },

  validateField: function(fieldName, fieldValue) {
    var updatedField = {};

    updatedField[fieldName] = fieldValue;
    this.set(updatedField);

    this.handleFieldValidation(this.validate(updatedField), fieldName);
  }
});

module.exports = Payment;
