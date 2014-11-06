"use strict";

var _ = require('lodash');
var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;
var PaymentActions = require('../actions.js');
var CurrentPath = require('react-router').CurrentPath;
var url = require('url');
var moment = require('moment');
var numeral = require('numeral');
var getSymbol = require('currency-symbol-map');

var PaymentItem = require('./payment.jsx');

var Collection = require('../collections/payments.js');
var collection = new Collection();

var getStateFromStores = function(store) {
  return {
    payments: store
  };
};

var Payments = React.createClass({
  mixins: [CurrentPath],

  getInitialState: function() {
    //return getStateFromStores(collection);
    return { payments: []};
  },

  componentDidMount: function() {
    collection.on("sync", this.handleCollectionChange);
    PaymentActions.updateUrl(this.getCurrentPath());
  },

  handleCollectionChange: function(collection) {
    if (this.isMounted()) {
      this.setState({
        payments: collection
      });
    }
  },

  componentWillUnmount: function() {
    collection.off("sync");
  },

  handleClick: function(e) {
    PaymentActions.delete(e.id);
  },

  render: function() {


    var paymentItems = this.state.payments.map(function(model) {
      var id = model.get('id');
      var currency=model.get("from_currency");

      return (
          <PaymentItem
            key={id}
            timeStamp={moment(model.get("createdAt")).format('MMM D, YYYY HH:mm z')}
            sourceAddress={model.get("from_issuer")}
            currency={currency}
            symbol={getSymbol(currency)}
            amount={numeral(model.get("from_amount")).format('0,0.00')}
            onClick={this.handleClick.bind(this, "foo")}
          />);
    }, this);

    return (
      <div>
        <h1>Payments here</h1>
        <ul className="list-group">
        {paymentItems}
        </ul>
      </div>
    );
  }
});

module.exports = Payments;
