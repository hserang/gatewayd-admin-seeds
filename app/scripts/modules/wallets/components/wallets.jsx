"use strict";

var React = require('react');
var Wallet = require('./wallet.jsx');
var Balances = require('../collections/balances');
var hotWalletBalances = new Balances([], 'hot');
var coldWalletBalances = new Balances([], 'cold');

var Wallet = React.createClass({
  render: function() {
    return (
      <Wallet type={"hot"} collection={hotWalletBalances} />
      <Wallet type={"cold"} collection={coldWalletBalances} />
    );
  }
});

module.exports = Wallet;
