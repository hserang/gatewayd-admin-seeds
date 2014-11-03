var Dispatcher = require('../shared/dispatcher');
var session = require('./config.json');

var UserActions = {
  login: function(name, sessionKey) {
    Dispatcher.dispatch({
      actionType: session.actions.login,
      data: {
        name: name,
        sessionKey: sessionKey
      }
    });
  }
};

module.exports = UserActions;
