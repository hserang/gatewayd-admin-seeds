var adminDispatcher = require('../../dispatchers/admin-dispatcher');
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
  },

  sendPaymentAttempt: function(payment) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.sendPaymentAttempt,
      data: payment
    });
  },

  sendPaymentComplete: function(payment) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.sendPaymentComplete,
      data: payment
    });
  }
};

module.exports = actions;
