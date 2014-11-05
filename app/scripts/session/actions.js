var Dispatcher = require('../dispatchers/dispatcher');
var session = require('./config.json').actions;

var SessionActions = {
  login: function(name, sessionKey) {
    Dispatcher.dispatch({
      actionType: session.login,
      data: {
        name: name,
        sessionKey: sessionKey
      }
    });
  },

  logout: function() {
    Dispatcher.dispatch({
      actionType: session.logout
    });
  },

  restore: function() {
    Dispatcher.dispatch({
      actionType: session.restore
    });
  }
};

module.exports = SessionActions;
