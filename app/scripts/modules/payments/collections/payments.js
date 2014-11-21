'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var payments = require('../config.json');
var Model = require('../models/payment.js');
var session = require('../../../modules/session/models/session');
var appConfig = require('../../../shared/app-config');

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  url: appConfig.baseUrl,

  baseUrl: appConfig.baseUrl,

  comparator: function(a, b) {
    return b.id - a.id;
  },

  initialize: function() {
    _.bindAll(this);

    //register method with dispatcher
    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    if (_.isUndefined(this[payload.actionType])) {
      return false;
    }

    this[payload.actionType](payload.data);
  },

  updateBaseUrl: function(newBaseUrl) {
    this.url = this.baseUrl = newBaseUrl;
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
    var page = page.split('/')[2];
    var baseUrl = session.get('gatewaydUrl') || this.baseUrl;

    if (!page || _.isUndefined(this.urlObject[page])) {
      return false;
    }

    this.url = baseUrl + this.urlObject[page].path;
    this.httpMethod = this.urlObject[page].method;

    this.fetchRippleTransactions();
  },

  flagAsDone: function(id) {
    var model = this.get(id);

    model.set({
      state: 'succeeded'
    });

    model.save('state', 'succeeded', {
      url: model.baseUrl + this.urlObject.flagAsDone.path + id,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', session.get('credentials'));
      }
    });
  },

  fetchRippleTransactions: function() {
    var _this = this;

    var ids = _.map(this.models, function(model) {
      return model.get('id');
    });

    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    })
    .then(function() {
      if (!ids.length) {
        _this.models.forEach(function(model) {
          model.set('new', false);
        });

        return true;
      }

      var newIds = _.map(_this.models, function(model) {
        return model.get('id');
      });

      var diffIds = _.reject(newIds, function(id) {
        return ids.indexOf(id) > -1;
      });


      _this.models.forEach(function(model) {
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
    }).then(function() {
      _this.get(paymentData.id).pollStatus();
    });
  }
});

module.exports = Payments;
