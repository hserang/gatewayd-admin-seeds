var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var userActions = require('./config.json').actions;

var UserActions = {
  reset: function() {
    adminDispatcher.handleEvent({
      actionType: userActions.reset
    });
  },

  update: function(name) {
    adminDispatcher.handleEvent({
      actionType: userActions.update,
      payload: name
    });
  }
};

module.exports = UserActions;
