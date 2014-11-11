'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var payments = require('../config.json');
var Model = require('../models/payment.js');
var session = require('../../../modules/session/models/session');

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  baseUrl: "http://localhost:5000",

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

  urlObject: {
    "/payments": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/incoming": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/completed": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/failed": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/outgoing": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/new": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    }
    // "/payments/new": {
    //   "path": "/v1/ripple_transactions/:id",
    //   "method": "post"
    // }
  },

  updateUrl: function(page) {
    if (!page || _.isUndefined(this.urlObject[page])) {
      return false;
    }

    this.url = this.baseUrl + this.urlObject[page].path;
    this.httpMethod = this.urlObject[page].method;

    this.fetchData();
  },

  fetchData: function() {
    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    });
  },

  directionMap: {
    incoming: "from-ripple",
    outgoing: "to-ripple"
  },

  filterByDirection: function(direction) {
    var _this = this;

    var filtered = this.filter(function(model) {
      return model.get("direction") === _this.directionMap[direction];
    });

    return new Payments(filtered);
  },

  //create fixture. delete when db ready
  getFakeType: function(data) {
    var output;

    output = _.map(data.ripple_transactions, function(model) {
      return _.extend({direction: Math.round(Math.random()) ? "to-ripple" : "from-ripple"}, model);
    });

    return {ripple_transactions: output};
  },

  parse: function(data) {
    // add fixture. Remove when db is ready
    data = this.getFakeType(data);

    return data.ripple_transactions;
  }
});

module.exports = Payments;
