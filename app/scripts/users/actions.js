var Dispatcher = require('../../shared/dispatcher');
var user = require('./config.json');

var UserActions = {
  login: function(name, password) {
    Dispatcher.dispatch({
      actionType: user.actions.login,
      data: {
        name: name,
        password: password
      }
    });
  }
};

module.exports = UserActions;
