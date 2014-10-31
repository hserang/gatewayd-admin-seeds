'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var payments = require('../config.json');
var Model = require('../models/payment.js');

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  initialize: function() {

    //register method with dispatcher
    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    console.log("dispatcher cb called", arguments);
  }

});

module.exports = Payments;
