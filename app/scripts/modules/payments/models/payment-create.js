'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var RippleName = require('ripple-name');
var dispatcher = require('../../../dispatchers/admin-dispatcher');
var session = require('../../session/models/session');
var payment = require('../config.json');
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

    if (attribute === null && !requirements.isRequired) {
      return true;
    }

    var testValid = {
      object: this.handleObject,
      string: this.handleString,
    };
    var isDefined = !_.isUndefined(attribute);
    var type = requirements.type === 'array' ? 'object' : requirements.type;
    var isValid = typeof attribute === 'number' ? !isNaN(attribute) : typeof attribute === type;

    if (isValid && !_.isUndefined(testValid[typeof attribute])) {
      isValid = testValid[typeof attribute](attribute, requirements.minLength);
    }

    // custom error messaging
    if (!isDefined) {
      this.validationErrors.push('"' + attr + '" is undefined');
    } else if (!isValid) {
      this.validationErrors.push('"' + attr + '" is invalid');
    }

    return isDefined && isValid;
  },

  validate: function() {
    var isValid = true,
        _this = this;

    this.validationErrors = [];

    if (arguments.length && typeof arguments[0] === 'string') {
      var attributeToTest = arguments[0];

      // for testing single attributes, passed in as a string
      if (!_this.testValid(attributeToTest, this.validationRules[attributeToTest])) {
        isValid = false;
      }
    } else {
      _.each(this.requiredAttrs, function(requirements, requiredAttr) {
        // for testing all required attributes (this.requiredAttrs)
        if (!_this.testValid(requiredAttr, requirements)) {
          isValid = false;
        }
      });
    }

    if (!isValid) {
      return this.validationErrors.join(', ');
    }
  },

  pollPaymentStatus: function(payment) {
    var _this = this;
    var isPending = true;

    var setHeader = function(xhr) {
      xhr.setRequestHeader('Authorization', session.get('credentials'));
    };

    var handleError = function(data) {
      isPending = false;
      clearInterval(intervalToken);
      _this.trigger('sendPaymentError', data.ripple_transaction.data.error || 'error');
      _this.trigger('sendPaymentComplete', data.ripple_transaction);
    };

    var handleSuccess = function(data) {
      if (data.ripple_transaction.state === 'succeeded') {
        isPending = false;
        clearInterval(intervalToken);
        _this.trigger('sendPaymentSuccess');
        _this.trigger('sendPaymentComplete', data.ripple_transaction);
      } else if (data.ripple_transaction.state === 'failed') {
        handleError(data);
      }
    };

    var requestPaymentStatus = function() {
      _this.trigger('pollingPaymentState');
      $.ajax({
        url: 'http://localhost:5000/v1/ripple_transactions/' + payment.id,
        type: 'GET',
        dataType: 'json',
        success: handleSuccess,
        error: handleError,
        beforeSend: setHeader
      });
    };

    var intervalToken = setInterval(requestPaymentStatus, 5000);
  },

  postPayment: function() {
    var _this = this;

    this.save(null, {
      contentType: 'application/json',
      headers: {
        Authorization: session.get('credentials')
      },
      success: function(model, response, xhr) {
        _this.pollPaymentStatus(response.payment);
      },
      error: function(model, response, xhr) {
        _this.trigger('sendPaymentError', response.responseJSON.error.message);
      }
    });
  },

  sendPaymentAttempt: function(payment) {
    var _this = this;

    this.clear({silent: true});
    this.set(payment);
    this.validate();

    if (this.validationErrors.length) {
      this.trigger('sendPaymentError', this.validationErrors.join(', '));
      return false;
    }

    RippleName.lookup(payment.address)
    .then(function(data) {
      if (data.exists) {
        _this.set('address', data.address);

        _this.postPayment();
      } else {
        _this.trigger('sendPaymentError', 'ripple name does not exist');
      }
    })
    .error(function() {
      _this.trigger('sendPaymentError', 'ripple name/address lookup failed');
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
    var _this = this;

    RippleName.lookup(address)
    .then(function(data) {
      if (data.exists) {
        _this.set('address', data.address);
        _this.handleFieldValidation(_this.validate('address'), 'address');
      } else {
        _this.trigger('validationComplete', false, 'address', 'ripple name does not exist');
      }
    })
    .error(function() {
      _this.trigger('validationComplete', false, 'address', 'ripple name lookup failed');
    });
  },

  validateAmount: function(amount) {
    this.set({
      amount: amount
    });

    this.handleFieldValidation(this.validate('amount'), 'amount');
  },

  validateCurrency: function(currency) {
    this.set({
      currency: currency
    });

    this.handleFieldValidation(this.validate('currency'), 'currency');
  },

  validateDestinationTag: function(destinationTag) {
    this.set({
      destinationTag: destinationTag
    });

    this.handleFieldValidation(this.validate('destinationTag'), 'destinationTag');
  },

  validateSourceTag: function(sourceTag) {
    this.set({
      sourceTag: sourceTag
    });

    this.handleFieldValidation(this.validate('sourceTag'), 'sourceTag');
  },

  validateInvoiceId: function(invoiceId) {
    this.set({
      invoiceId: invoiceId
    });

    this.handleFieldValidation(this.validate('invoiceId'), 'invoiceId');
  },

  validateMemo: function(memo) {
    this.set({
      memo: memo
    });

    this.handleFieldValidation(this.validate('memo'), 'memo');
  }
});

module.exports = Payment;
