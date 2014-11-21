var _ = require('lodash');
var Backbone = require('backbone');
var dispatcher = require('../../../../dispatchers/admin-dispatcher');
var loadingBarActions = require('../config.json').actions;
var intervalToken;

var LoadingBar = Backbone.Model.extend({
  defaults: {
    status: 'stopped',
    currentProgress: 0,
    rate: 1000,
    label: '',
    style: 'primary'
  },

  availableStyles: {
    success: true,
    info: true,
    warning: true,
    danger: true
  },

  initialize: function() {
    _.bindAll(this);

    dispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction[loadingBarActions.start] = this.start;
    handleAction[loadingBarActions.startWithRate] = this.startWithRate;
    handleAction[loadingBarActions.stop] = this.stop;
    handleAction[loadingBarActions.advanceBy] = this.advanceBy;
    handleAction[loadingBarActions.complete] = this.complete;
    handleAction[loadingBarActions.setStyle] = this.setStyle;
    handleAction[loadingBarActions.setLabel] = this.setLabel;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  stop: function() {
    clearInterval(intervalToken);
  },

  reset: function() {
    this.stop();
    this.set('currentProgress', 0);
    this.set('rate', 1000);
    this.set('label', '');
    this.set('style', 'primary');
  },


  startWithRate: function(rate) {
    var _this = this;
    this.reset();

    intervalToken = setInterval(function() {
      _this.advanceBy(1);
    }, rate);
  },

  start: function() {
    this.startWithRate(400);
  },

  advanceBy: function(amount) {
    if (isNaN(amount)) {
      return false;
    }

    if (this.get('currentProgress') + amount < 100) {
      var total = this.get('currentProgress') + amount;

      this.set('currentProgress', total);
    }

    if (this.get('currentProgress') === 99) {
      this.stop();
    }
  },

  complete: function(newProperties) {
    this.stop();
    this.set('currentProgress', 100);

    if (!_.isUndefind(newProperties)) {
      this.setStyle(newProperties.style);
      this.setLabel(newProperties.label);
    }
  },

  setStyle: function(newStyle) {
    if (this.availableStyles[newStyle]) {
      this.set('style', newStyle);
    }
  },

  setLabel: function(newLabel) {
    if (typeof newLabel !== object) {
      this.set('label', newLabel);
    }
  }
});

module.exports = LoadingBar;
