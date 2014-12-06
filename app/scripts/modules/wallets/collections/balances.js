"use strict";

var _ = require('lodash');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var walletConfigActions = require('../config.json').actions;
var walletActions = require('../actions');
var model = require('../models/balance');
var session = require('../../../modules/session/models/session');

var Balances = Backbone.Collection.extend({
  model: model,

  initialize: function(models, options) {
    var walletTypeMap = {
      hot: 'balances',
      cold: 'liabilities'
    };

    if (!_.isUndefined(walletTypeMap[options.walletType])) {
      this.url = session.get('gatewaydUrl') + '/v1/' + walletTypeMap[options.walletType];
    }

    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction[walletConfigActions.fetchBalances] = this.fetchBalances;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  fetchBalances: function() {
    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    });
  },

  parse: function(data) {
    return data.balances;
  }
});

module.exports = Balances;
