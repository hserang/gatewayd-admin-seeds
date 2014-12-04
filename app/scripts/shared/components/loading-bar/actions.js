var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var loadingBar = require('./config.json').actions;

var LoadingBar = {
  start: function() {
    adminDispatcher.dispatch({
      actionType: loadingBar.start
    });
  },

  startWithRate: function(rate) {
    adminDispatcher.dispatch({
      actionType: loadingBar.startWithRate,
      data: rate
    });
  },

  stop: function() {
    adminDispatcher.dispatch({
      actionType: loadingBar.stop
    });
  },

  advanceBy: function(rate) {
    adminDispatcher.dispatch({
      actionType: loadingBar.advanceBy,
      data: rate
    });
  },

  complete: function(label, style) {
    adminDispatcher.dispatch({
      actionType: loadingBar.complete,
      data: {
        label: label,
        style: style
      }
    });
  },

  setStyle: function(newStyle) {
    adminDispatcher.dispatch({
      actionType: loadingBar.setStyle,
      data: newStyle
    });
  },

  setLabel: function(newLabel) {
    adminDispatcher.dispatch({
      actionType: loadingBar.setLabel,
      data: newLabel
    });
  }
};

module.exports = LoadingBar;
