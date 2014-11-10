"use strict";

var _ = require('lodash');
var React = require('react');
var Button = require('react-bootstrap').Button;
var PaymentActions = require('../actions.js');
var CurrentPath = require('react-router').CurrentPath;
var url = require('url');
var moment = require('moment');
var numeral = require('numeral');
var getSymbol = require('currency-symbol-map');

var PaymentItem = require('./payment.jsx');

var Collection = require('../collections/payments.js');
var collection = new Collection();

var Model = require('../models/payment-create.js');
var model = new Model();

var PaymentCreateForm = require('./payment-create.jsx');

var Payments = React.createClass({
  mixins: [CurrentPath],

  getStateFromStore: function(props) {
    props = props || this.props;
    return {
      payments: collection,
      showForm: false,
      toggledSymbol: '+'
    };
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  componentDidMount: function() {
    collection.on('sync', this.handleCollectionChange);
    collection.on('paymentComplete', this.resetFormState);
    PaymentActions.updateUrl(this.getCurrentPath());
  },

  componentWillUnmount: function() {
    collection.off('sync');
    collection.off('paymentComplete');
  },

  handleCollectionChange: function(collection) {
    this.setState({
      payments: collection
    });
  },


  handleClick: function(e) {
    PaymentActions.delete(e.id);
  },

  toggleForm: function() {
    var showFormSymbols = {
      false: '-',
      true: '+'
    };

    this.setState({
      showForm: !this.state.showForm
    });

    this.setState({
      toggledSymbol: showFormSymbols[this.state.showForm]
    });
  },

  resetFormStateHelper: function() {
    this.setState({
      showForm: false,
      toggledSymbol: '+'
    });
  },

  resetFormState: function(paymentWasSuccessful) {
    var _this = this;

    if (paymentWasSuccessful) {
      setTimeout(_this.resetFormStateHelper, 5000);
    } else {
      _this.forceUpdate();
    }
  },

  render: function() {
    var paymentItems = this.state.payments.filterByDirection(this.props.params.filter).map(function(model) {
      var id = model.get('id');
      var currency=model.get("from_currency");

      return (
          <PaymentItem
            key={id}
            timeStamp={moment(model.get("createdAt")).format('MMM D, YYYY HH:mm z')}
            sourceAddress={model.get("from_issuer")}
            currency={currency}
            symbol={getSymbol(currency)}
            // amount={numeral(model.get("from_amount")).format('0,0.00')}
            amount={model.get("from_amount")}
            onClick={this.handleClick.bind(this, "foo")}
          />);
    }, this);

    return (
      <div>
        {this.state.showForm ? <PaymentCreateForm model={model} /> : null}
        <div>
          <Button className="pull-right" onClick={this.toggleForm}>{this.state.toggledSymbol}</Button>
          <h1>Payments here</h1>
        </div>
        <ul className="list-group">
        {paymentItems}
        </ul>
      </div>
    );
  }
});

module.exports = Payments;
