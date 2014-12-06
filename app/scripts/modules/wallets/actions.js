var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var wallet = require('./config.json').actions;

var WalletActions = {
  fetchBalances: function() {
    adminDispatcher.dispatch({
      actionType: 'fetchBalances'
    });
  }
};

module.exports = WalletActions;
