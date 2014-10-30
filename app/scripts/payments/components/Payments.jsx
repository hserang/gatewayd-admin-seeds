"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;
var Dispatcher = require('../../dispatchers/dispatcher');

var PaymentItem = require('./payment.jsx');

var Collection = require('../collections/payments.js');
var collection = new Collection([
  {
    data: null,
    id: 1,
    to_address_id: 1,
    from_address_id: 2,
    transaction_state: null,
    transaction_hash: null,
    to_amount: "1",
    to_currency: "XRP",
    to_issuer: "4",
    from_amount: "2",
    from_currency: "USD",
    from_issuer: "5",
    createdAt: "2014-10-01T23:53:40.213Z",
    updatedAt: "2014-10-01T23:53:40.213Z",
    uid: null,
    client_resource_id: "false",
    state: "false",
    external_transaction_id: null
  },
  {
    data: null,
    id: 2,
    to_address_id: 2,
    from_address_id: 2,
    transaction_state: null,
    transaction_hash: null,
    to_amount: "2",
    to_currency: "XRP",
    to_issuer: "4",
    from_amount: "2",
    from_currency: "USD",
    from_issuer: "5",
    createdAt: "2014-10-01T23:53:40.213Z",
    updatedAt: "2014-10-01T23:53:40.213Z",
    uid: null,
    client_resource_id: "false",
    state: "false",
    external_transaction_id: null
  }
]
);

var getStateFromStores = function(store) {
  console.log("store", store);
  return {};
};

var Payments = React.createClass({
  getInitialState: function() {
    return getStateFromStores(collection);
  },

  componentDidMount: function() {
    collection.on("change", this.handleCollectionChange);
  },

  componentWillUnmount: function() {
    collection.off("change");
  },

  render: function() {
    var paymentItems = collection.map(function(model, index) {
      return <PaymentItem id={model.get('id')} />;
    });
    return (
      <div>
        <h1>Payments here</h1>
        {paymentItems}
      </div>
    );
  }
});

module.exports = Payments;
