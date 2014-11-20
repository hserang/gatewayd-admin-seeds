var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var paymentActions = require('./config.json').actions;

var actions = {
  updateUrl: function(path) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.updateUrl,
      data: path
    });
  },

  flagAsDone: function(id) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.flagAsDone,
      data: id
    });
  },

  filterByState: function(state) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.filterByState,
      data: state
    });
  },

  // to payment-create.js
  sendPaymentAttempt: function(payment) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.sendPaymentAttempt,
      data: payment
    });
  },

  // to payments.js
  sendPaymentComplete: function(payment) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.sendPaymentComplete,
      data: payment
    });
  },

  fetchRippleTransactions: function() {
    adminDispatcher.handleEvent({
      actionType: paymentActions.fetchRippleTransactions
    });
  },

  hidePaymentDetails: function() {
    adminDispatcher.handleEvent({
      actionType: paymentActions.hidePaymentDetails
    });
  }
};

module.exports = actions;
