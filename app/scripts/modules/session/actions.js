var AdminDispatcher = require('../../dispatchers/admin-dispatcher');
var session = require('./config.json').actions;

var SessionActions = {
  login: function(name, sessionKey) {
    AdminDispatcher.dispatch({
      actionType: session.login,
      data: {
        name: name,
        sessionKey: sessionKey
      }
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
  }
};

module.exports = SessionActions;
