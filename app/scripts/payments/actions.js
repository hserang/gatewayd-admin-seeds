var adminDispatcher = require('../dispatchers/admin-dispatcher');
var paymentActions = require('./config.json').actions;

var actions = {
  delete: function(id) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.delete,
      data: id
    });
  },

  updateUrl: function(path) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.updateUrl,
      data: path
    });
  }
};

module.exports = actions;
