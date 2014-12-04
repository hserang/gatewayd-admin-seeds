"use strict";

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var ValidationMixins = require('../../../shared/helpers/validation_mixin');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var user = require('../config.json');
Backbone.$ = $;

var User = Backbone.Model.extend({

  //todo: review the defaults and tests since they pass validation tests
  defaults: {
    name: 'guest',
    role: 'guest',
    isLoggedIn: false
  },

  validationRules: {
    name: {
     validators: ['isRequired', 'minLength:1']
    },
    isLoggedIn: {
      validators: ['isBoolean']
    }
  },

  initialize: function() {
    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};
    handleAction[user.actions.reset] = this.reset;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  reset: function() {
    this.set(this.defaults);
  },

  update: function(name) {
    this.set({
      name: name,
      role: name.split('@')[0],
      isLoggedIn: true
    });
  }
});

//add validation mixin
_.extend(User.prototype, ValidationMixins);

module.exports = User;
