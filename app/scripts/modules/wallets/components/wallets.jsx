"use strict";

var React = require('react');
var Wallet = require('./wallet.jsx');
var Balances = require('../collections/balances');
var hotWalletBalances = new Balances([], {walletType: 'hot'});
var coldWalletBalances = new Balances([], {walletType: 'cold'});

var Wallets = React.createClass({
  render: function() {
    return (
      <div>
        <Wallet type={"hot"} collection={hotWalletBalances} />
        <Wallet type={"cold"} collection={coldWalletBalances} />
      </div>
    );
  }
});

module.exports = Wallets;
