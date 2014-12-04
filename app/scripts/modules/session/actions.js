var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var session = require('./config.json').actions;

var SessionActions = {
  login: function(loginDetails) {
    adminDispatcher.dispatch({
      actionType: session.login,
      data: loginDetails
    });
  },

  logout: function() {
    adminDispatcher.dispatch({
      actionType: session.logout
    });
  },

  restore: function() {
    adminDispatcher.dispatch({
      actionType: session.restore
    });
  }
};

module.exports = SessionActions;
