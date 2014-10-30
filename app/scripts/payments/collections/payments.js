'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var Dispatcher = require('../../shared/dispatcher');
var payments = require('../config.json');
Backbone.$ = $;

var Payments = Backbone.Collection.extend({});

module.exports = Payments;
