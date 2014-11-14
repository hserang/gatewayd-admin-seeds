"use strict";

var _ = require('lodash');
var React = require('react');
var DocumentTitle = require('react-document-title');
var Button = require('react-bootstrap').Button;
var PaymentActions = require('../actions.js');
var CurrentPath = require('react-router').CurrentPath;
var Link = require('react-router').Link;
var url = require('url');
var moment = require('moment');
var numeral = require('numeral');
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

  handleFilter: function(e) {
    e.preventDefault();
    var filterType = e.target.getAttribute('value');

    if (filterType) {
      PaymentActions.filterByState(filterType);
    }
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
          currency = model.get('from_currency');

      return (
          <PaymentItem
            key={id}
            id={id}
            direction={model.get('direction')}
            timeStamp={moment(model.get('createdAt')).format('MMM D, YYYY HH:mm z')}
            fromAddress={model.get('fromAddress').address}
            toAddress={model.get('toAddress').address}
            currency={currency}
            state={model.get('state')}
            amount={model.get('from_amount')}
            clickHandler={this.handleClick}
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
        <div className='row' onClick={this.handleFilter}>
          <div className="col-xs-12">
            Filter By:
            <button value="incoming">incoming</button>
            <button value="outgoing">outgoing</button>
            <button value="failed">failed</button>
            <button value="pending">pending</button>
            <button value="completed">completed</button>
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
