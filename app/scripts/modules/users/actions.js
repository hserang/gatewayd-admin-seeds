var AdminDispatcher = require('../../dispatchers/admin-dispatcher');
var userActions = require('./config.json').actions;

var UserActions = {
  reset: function() {
    AdminDispatcher.handleEvent({
      actionType: userActions.reset
    });
  },

  update: function(name) {
    AdminDispatcher.handleEvent({
      actionType: userActions.update,
      payload: name
    });
  }
};

module.exports = UserActions;
