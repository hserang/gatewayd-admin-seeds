"use strict";

var _ = require('lodash');
var $ = require('jquery');
var heartbeats = require('heartbeats');

var Backbone = require('backbone');
var ValidationMixins = require('../../../shared/helpers/validation_mixin');

var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var paymentConfigActions = require('../config.json').actions;
var session = require('../../../modules/session/models/session');

var pollingHeart = new heartbeats.Heart(5000);

Backbone.$ = $;

var Payment = Backbone.Model.extend({
  defaults: {
    id: 0,
    createdAt: 0,
    updatedAt: 0,
    uid: 0,
    client_resource_id: 0,
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

  validationRules: {
    to_address_id: {
      validators: ['isRequired', 'isNumber'] // int
    },
    from_address_id: {
      validators: ['isRequired', 'isNumber'] // int
    },
    to_amount: {
      validators: ['isRequired', 'isNumber'] // decimal
    },
    to_currency: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    to_issuer: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    from_amount: {
      validators: ['isRequired', 'isNumber'] // decimal
    },
    from_currency: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    from_issuer: {
      validators: ['isRequired', 'isString', 'minLength:1']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction[paymentConfigActions.retryFailedPayment] = this.retryFailedPayment;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  parse: function(data, options) {
    // fetching from collection uses model's parse method
    if (options.collection) {
      return data;
    }

    return data.ripple_transaction;
  },

  checkPollCompletion: function(model) {
    if (model.get('state') === 'succeeded' || model.get('state') === 'failed') {
      pollingHeart.clearEvents();
      this.trigger('retryStop');
    }
  },

  pollStatusHelper: function() {
    this.fetch({
      url: session.get('gatewaydUrl') + '/v1/ripple_transactions/' + this.get('id'),
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: session.get('credentials')
      },
      success: this.checkPollCompletion
    });
  },

  pollStatus: function() {
    var _this = this;

    // update displayed payment information every interval to watch status changes
    pollingHeart.onBeat(1, this.pollStatusHelper);
    pollingHeart.onceOnBeat(0, this.trigger('retryStart'));

    // stop polling after 10 intervals
    pollingHeart.onceOnBeat(10, function() {
      pollingHeart.clearEvents();
      _this.trigger('retryStop');
    });
  },

  retryFailedPayment: function(id) {
    if (id !== this.get('id')) {
      return false;
    }

    this.save(null, {
      type: 'post',
      url: session.get('gatewaydUrl') + '/v1/payments/failed/' + this.get('id') + '/retry',
      contentType: 'application/json',
      headers: {
        Authorization: session.get('credentials')
      },
      success: this.pollStatus
    });
  },
});

//add validation mixin
_.extend(Payment.prototype, ValidationMixins);

module.exports = Payment;
