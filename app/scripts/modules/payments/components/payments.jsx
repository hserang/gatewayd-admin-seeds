"use strict";

var _ = require('lodash');
var React = require('react');
var DocumentTitle = require('react-document-title');
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
    collection.on('sync add', this.handleCollectionChange);
    PaymentActions.updateUrl(this.getCurrentPath());
  },

  componentWillUnmount: function() {
    collection.off('sync');
    collection.off('add');
  },

  handleCollectionChange: function() {
    this.setState({
      payments: this.state.payments
    });
  },

  handleClick: function(id) {
    PaymentActions.flagAsDone(id);
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

  closeForm: function() {
    this.setState({
      showForm: false,
      toggledSymbol: this.formSymbolMap[false]
    });
  },

  createTitle: function(filter) {
    filter = filter || 'incoming';

    var titleMap = {
      incoming: 'Received Payments',
      outgoing: 'Sent Payments'
    };

    return titleMap[filter];
  },

  render: function() {
    var paymentItems = this.state.payments
        .filterByDirection(this.props.params.filter).map(function(model) {
      var id = model.get('id'),
          currency = model.get("from_currency");

      return (
          <PaymentItem
            key={id}
            id={id}
            timeStamp={moment(model.get("createdAt")).format('MMM D, YYYY HH:mm z')}
            sourceAddress={model.get("from_issuer")}
            currency={currency}
            state={model.get('state')}
            clickHandler={this.handleClick}
            symbol={getSymbol(currency)}
            // amount={numeral(model.get("from_amount")).format('0,0.00')}
            amount={model.get("from_amount")}
          />);
    }, this);

    //todo abstract the ul and its children to a component
    return (
      <DocumentTitle title={this.createTitle(this.props.params.filter)}>
      <div>
        <div className="row">
          {this.state.showForm ? <PaymentCreateForm model={model} onSubmitSuccess={this.closeForm} /> : null}
          <div className="col-sm-4 col-xs-4">
            <h1>Payments:
              <span className='header-links'>
                <Link to='/payments/outgoing'>
                  Sent
                </Link>
                <Link to='/payments/incoming'>
                  Received
                </Link>
              </span>
            </h1>
          </div>
          <Button className="pull-right" onClick={this.toggleForm}>{this.state.toggledSymbol}</Button>
        </div>
        <div className='row'>
          <div className="col-xs-12">
            Filter By: incoming outgoing failed completed
          </div>
        </div>
        <div className="row">
          <ul className="list-group">
          {paymentItems}
          </ul>
        </div>
      </div>
      </DocumentTitle>
    );
  }
});

module.exports = Payments;
