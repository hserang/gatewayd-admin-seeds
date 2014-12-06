"use strict";

var React = require('react');
var WalletEntry = require('./wallet-entry.jsx');

var Wallet = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    collection: React.PropTypes.object
  },

  render: function() {
    var titleMap = {
      hot: 'Hot Wallet Balances',
      cold: 'Cold Wallet Liabilities'
    };
    var buildBalances = function(balances) {
      var balanceEntries = this.props.collection.map(function(model) {
        return (
          <WalletEntry
              currency={model.get('currency')}
              amount={model.get('amount')}
              counterparty={model.get('counterparty')}
          />
        );
      });
    };

    return (
      <h3>titleMap[this.props.type]</h3>
      <ul>
        <li className="list-group-item">
          <div className="row border-top border-bottom">
            <div className="col-sm-2">
              Currency
            </div>
            <div className="col-sm-2 col-sm-offset-1">
              Amount
            </div>
          </div>
        </li>
        {buildBalances(this.props.collection)}
      </ul>
    );
  }
});

module.exports = Wallet;
