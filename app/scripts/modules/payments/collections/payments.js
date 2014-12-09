"use strict";

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var paymentConfigActions = require('../config.json').actions;
var session = require('../../../modules/session/models/session');
var Model = require('../models/payment.js');

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  comparator: function(a, b) {
    return b.id - a.id;
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    var handleAction = {};

    handleAction[paymentConfigActions.updateUrl] = this.updateUrl;
    handleAction[paymentConfigActions.flagAsDone] = this.flagAsDone;
    handleAction[paymentConfigActions.fetchRippleTransactions] = this.fetchRippleTransactions;
    handleAction[paymentConfigActions.sendPaymentComplete] = this.sendPaymentComplete;

    if (!_.isUndefined(this[payload.actionType])) {
      this[payload.actionType](payload.data);
    }
  },

  urlObject: {
    "payments": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "incoming": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "succeded": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "failed": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "outgoing": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "new": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "flagAsDone": {
      "path":"/v1/ripple_transactions/",
      "method": "save"
    }
  },

  updateUrl: function(page) {
    page = page.split('/')[2];

    if (!page || _.isUndefined(this.urlObject[page])) {
      return false;
    }

    this.url = session.get('gatewaydUrl') + this.urlObject[page].path;
    this.httpMethod = this.urlObject[page].method;

    this.fetchRippleTransactions();
  },

  flagAsDone: function(id) {
    var model = this.get(id);

    model.set({
      state: 'succeeded'
    });

    model.save('state', 'succeeded', {
      url: session.get('gatewaydUrl') + this.urlObject.flagAsDone.path + id,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', session.get('credentials'));
      }
    });
  },

  fetchRippleTransactions: function() {
    var _this = this;

    // array of current transaction ids
    var ids = _.map(this.models, function(model) {
      return model.get('id');
    });

    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    })
    .then(function() {

      // 'new' attribute is reset for all existing payment models
      if (!ids.length) {
        _this.models.forEach(function(model) {
          model.set('new', false);
        });

        return true;
      }

      // array of current payment ids after fetch
      var newIds = _.map(_this.models, function(model) {
        return model.get('id');
      });

      // array of payment ids existing only in newIds
      var diffIds = _.reject(newIds, function(id) {
        return ids.indexOf(id) > -1;
      });

      _this.models.forEach(function(model) {

        // payments whose model Ids are in diffIds get a 'new' attribute
        // 'new' models will be highlighted
        if (diffIds.indexOf(model.get('id')) > -1) {
          model.set('new', true);
        } else {
          model.set('new', false);
        }
      });
    });
  },

  parse: function(data) {
    return data.ripple_transactions;
  },

  sendPaymentComplete: function(paymentData) {
    var _this = this;

    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    })
    .then(function() {

      // poll status of sent payment until failed/succeeded to see changes
      _this.get(paymentData.id).pollStatus();
    });
  }
});

module.exports = Payments;
