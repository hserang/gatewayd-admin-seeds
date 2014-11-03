'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var payments = require('../config.json');
var Model = require('../models/payment.js');
var session = require('../../session/models/session');
console.log("ses", session);

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  baseUrl: "http://localhost:5000",

  initialize: function() {

    //register method with dispatcher
    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    console.log("dispatcher cb called", arguments);
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
    "/payments/new": {
      "path": "/v1/ripple_transactions/:id",
      "method": "post"
    }
  },

  updateUrl: function(page) {
    if (!page || _.isUndefined(this.urlObject[page])) {
      return false;
    }

    this.url = this.baseUrl + this.urlObject[page].path;
    this.httpMethod = this.urlObject[page].method;

    console.log("collection url", this.url);
    this.fetchData();
  },

  fetchData: function() {
    console.log("fetchData", session.get('credentials'));

    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    });
  }
});

module.exports = Payments;
