'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var Dispatcher = require('../../shared/dispatcher');
var payments = require('../config.json');
var Model = require('../models/payment.js');

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  initialize: function() {
  }

});

module.exports = Payments;
