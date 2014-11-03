"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;
var PaymentActions = require('../actions.js');
var CurrentPath = require('react-router').CurrentPath;
var url = require('url');

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
    return getStateFromStores(collection);
  },

  componentDidMount: function() {
    collection.on("change", this.handleCollectionChange);
  },

  componentWillUnmount: function() {
    collection.off("change");
  },

  handleClick: function(e) {
    console.log("top", e);
    PaymentActions.delete(e.id);
  },

  render: function() {

    collection.updateUrl(this.getCurrentPath());

    var paymentItems = this.state.payments.map(function(model) {
      var id = model.get('id');

      return <PaymentItem key={id} id={id}  onClick={this.handleClick.bind(this, "foo")}/>;
    }, this);

    return (
      <div>
        <h1>Payments here</h1>
        {paymentItems}
        <p>props {this.props.foo}</p>
        <p>Path is: {this.getCurrentPath()}</p>
      </div>
    );
  }
});

module.exports = Payments;
