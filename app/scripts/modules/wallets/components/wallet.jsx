"use strict";

var React = require('react');
var WalletEntry = require('./wallet-entry.jsx');

var Wallet = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    collection: React.PropTypes.object
  },

  render: function() {
    var _this = this;
    var titleMap = {
      hot: 'Hot Wallet Balances',
      cold: 'Cold Wallet Liabilities'
    };
    var buildBalanceEntries = function(balances) {
      var balanceEntries = _this.props.collection.map(function(model) {
        return (
          <WalletEntry
            key={model.cid}
            currency={model.get('currency')}
            value={model.get('value')}
            counterparty={model.get('counterparty')}
          />
        );
      });

      return balanceEntries;
    };

    return (
      <div>
        <h3>{titleMap[this.props.type]}</h3>
        <ul className="wallet">
          <li className="list-group-item wallet-header">
            <div className="row">
              <div className="col-sm-3 col-xs-6">
                <strong>Currency</strong>
              </div>
              <div className="col-sm-3 col-xs-6 col-sm-offset-1">
                <strong>Value</strong>
              </div>
            </div>
          </li>
          {buildBalanceEntries(this.props.collection)}
        </ul>
      </div>
    );
  }
});

module.exports = Wallet;
