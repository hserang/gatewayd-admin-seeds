var AdminDispatcher = require('../../../dispatchers/admin-dispatcher');
var loadingBar = require('./config.json').actions;

var LoadingBar = {
  start: function() {
    AdminDispatcher.dispatch({
      actionType: loadingBar.start
    });
  },

  startWithRate: function(rate) {
    AdminDispatcher.dispatch({
      actionType: loadingBar.startWithRate,
      data: rate
    });
  },

  stop: function() {
    AdminDispatcher.dispatch({
      actionType: loadingBar.stop
    });
  },

  advanceBy: function(rate) {
    AdminDispatcher.dispatch({
      actionType: loadingBar.advanceBy,
      data: rate
    });
  },

  complete: function(label, style) {
    AdminDispatcher.dispatch({
      actionType: loadingBar.complete,
      data: {
        label: label,
        style: style
      }
    });
  },

  setStyle: function(newStyle) {
    AdminDispatcher.dispatch({
      actionType: loadingBar.setStyle,
      data: newStyle
    });
  },

  setLabel: function(newLabel) {
    AdminDispatcher.dispatch({
      actionType: loadingBar.setLabel,
      data: newLabel
    });
  }
};

module.exports = LoadingBar;
