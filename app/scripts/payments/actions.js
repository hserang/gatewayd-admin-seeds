var adminDispatcher = require('../dispatchers/admin-dispatcher');
var paymentActions = require('./config.json').actions;

var actions = {
  delete: function(id) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.delete,
      id: id
    });

  }
};

module.exports = actions;
