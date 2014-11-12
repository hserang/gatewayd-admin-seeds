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
var NavSecondary = require('../../../components/nav-secondary.jsx');

var PaymentItem = require('./payment.jsx');

var Collection = require('../collections/payments.js');
var collection = new Collection();

var Model = require('../models/payment-create.js');
var model = new Model();

var PaymentCreateForm = require('./payment-create.jsx');

var Payments = React.createClass({
  mixins: [CurrentPath],

  formSymbolMap: {
    true: '-',
    false: '+'
  },

  getStateFromStore: function(props) {
    props = props || this.props;
    return {
      payments: collection,
      showForm: false,
      toggledSymbol: this.formSymbolMap[false]
    };
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  componentDidMount: function() {
    collection.on('sync', this.handleCollectionChange);
    collection.on('add', this.resetFormState);
    PaymentActions.updateUrl(this.getCurrentPath());
  },

  componentWillUnmount: function() {
    collection.off('sync');
    collection.off('add');
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
    var newShowFormState = !this.state.showForm;

    this.setState({
      showForm: newShowFormState
    });

    this.setState({
      toggledSymbol: this.formSymbolMap[newShowFormState]
    });
  },

  resetFormStateHelper: function() {
    this.setState({
      showForm: false,
      toggledSymbol: this.formSymbolMap[false]
    });
  },

  resetFormState: function(updatedPaymentsCollection) {
    var _this = this;

    if (updatedPaymentsCollection.get('state') === 'succeeded') {
      setTimeout(_this.resetFormStateHelper, 5000);
    }
  },

  render: function() {
    var paymentItems = this.state.payments
        .filterByDirection(this.props.params.filter).map(function(model) {
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

    //todo abstract the ul and its children to a component
    return (
      <div>
        <div className="row">
          {this.state.showForm ? <PaymentCreateForm model={model} /> : null}
          <div className="col-sm-4 col-xs-4">
            <h1>Payments</h1>
          </div>
          <NavSecondary wrapperClassName="col-sm-5 col-xs-4"/>
          <Button className="pull-right" onClick={this.toggleForm}>{this.state.toggledSymbol}</Button>
        </div>
        <div className="row">
          <ul className="list-group">
          {paymentItems}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Payments;
