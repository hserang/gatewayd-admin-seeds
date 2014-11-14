var AdminDispatcher = require('../../dispatchers/admin-dispatcher');
var session = require('./config.json').actions;

var SessionActions = {
  login: function(loginDetails) {
    AdminDispatcher.dispatch({
      actionType: session.login,
      data: loginDetails
    });
  },

  logout: function() {
    AdminDispatcher.dispatch({
      actionType: session.logout
    });
  },

  restore: function() {
    AdminDispatcher.dispatch({
      actionType: session.restore
    });
  },

  updateBaseUrl: function(newBaseUrl) {
    AdminDispatcher.dispatch({
      actionType: session.updateBaseUrl,
      data: newBaseUrl
    });
  }
};

module.exports = SessionActions;
