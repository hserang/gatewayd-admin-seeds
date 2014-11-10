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
      minLength: 1 // some min for ripple address, but none for ripple name
    },
    amount: {
      type: 'number' // decimal
    },
    currency: {
      type: 'string',
      minLength: 3
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
      this.validationErrors.push('"' + attr + '" of created payment is undefined');
    } else if (!isValid) {
      this.validationErrors.push('"' + attr + '" of created payment is invalid');
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

  setPayment: function(payment) {
    this.set('address', payment.address);
    this.set('amount', payment.amount);
    this.set('currency', payment.currency);
    this.set('destinationTag', payment.destinationTag);
    this.set('sourceTag', payment.sourceTag);
    this.set('invoiceId', payment.invoiceId);
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

    var intervalToken = setInterval(requestPaymentStatus, 4000);
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

    RippleName.lookup(payment.address)
    .then(function(data) {
      if (data.exists) {
        payment.address = data.address;

        _this.setPayment(payment);
        _this.postPayment();
      } else {
        _this.trigger('sendPaymentError', 'ripple name does not exist');
      }
    })
    .error(function() {
      _this.trigger('sendPaymentError', 'ripple name/address lookup failed');
    });
  }
});

module.exports = Payment;
