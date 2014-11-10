'use strict';

var React = require('react');
var Navigation = require('react-router').Navigation;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ProgressBar = require('react-bootstrap').ProgressBar;
var paymentActions = require('../actions');

var PaymentCreate = React.createClass({
  mixins: [Navigation],

  formatInput: function(rawInputRef, type) {
    var formattedInput = rawInputRef.getValue().trim();

    return type === 'number' ? formattedInput * 1 : formattedInput;
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var payment = {
      address: this.formatInput(this.refs.address, 'string'),
      amount: this.formatInput(this.refs.amount, 'number'),
      currency: this.formatInput(this.refs.currency, 'string').toUpperCase(),
      destinationTag: this.formatInput(this.refs.destinationTag, 'number') || null,
      sourceTag: this.formatInput(this.refs.sourceTag, 'number') || null, // not implemented yet
      invoiceId: this.formatInput(this.refs.invoiceId, 'string') || null, // not implemented yet
      memo: this.formatInput(this.refs.memo, 'string') || null // not implemented yet
    };

    paymentActions.sendPaymentAttempt(payment);
    this.setState({
      progressLabel: '%(percent)s%',
      progressPercentage: 0,
      showProgressBar: true
    });
  },

  handleSuccess: function(payment) {
    this.setState({
      progressPercentage: 100,
      progressStyle: 'success'
    });
  },

  handleError: function(errorMessage) {
    this.setState({
      progressLabel: 'Error: ' + errorMessage,
      progressPercentage: 100,
      progressStyle: 'danger'
    });
  },

  dispatchSendPaymentComplete: function(payment) {
    this.setState({
      showGraphLink: true,
      graphUrl: this.state.graphUrl + payment.transaction_hash
    });

    paymentActions.sendPaymentComplete(payment);
  },

  handlePolling: function() {
    this.setState({
      progressPercentage: this.state.progressPercentage + 25,
      progressStyle: 'primary'
    });
  },

  getInitialState: function() {
    return {
      showProgressBar: false,
      progressLabel: '%(percent)s%',
      progressPercentage: 0,
      progressStyle: 'primary',
      showGraphLink: false,
      graphUrl: 'http://www.ripple.com/graph/'
    };
  },

  componentDidMount: function() {
    var _this = this;

    this.props.model.on('sendPaymentSuccess', this.handleSuccess);
    this.props.model.on('sendPaymentError', this.handleError);
    this.props.model.on('sendPaymentComplete', this.dispatchSendPaymentComplete);
    this.props.model.on('pollingPaymentState', this.handlePolling);
  },

  componentWillUnmount: function() {
    this.props.model.off('sendPaymentSuccess');
    this.props.model.off('sendPaymentError');
    this.props.model.off('sendPaymentComplete');
    this.props.model.off('pollingPaymentState');
  },

  render: function() {
    var graphLink = (
      <a href={this.state.graphUrl}>
        See this transaction in action: Ripple Graph
      </a>
    );
    var progressBar = (
      <div>
        <ProgressBar now={this.state.progressPercentage}
          label={this.state.progressLabel}
          bsStyle={this.state.progressStyle}
        />
        {this.state.showGraphLink ? graphLink : null}
      </div>
    );

    return (
      <div>
        <h2>Send Payment</h2>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" ref="address" label="Destination Address:" required />
          <Input type="text" ref="destinationTag" label="Destination Tag:" />
          <Input type="text" ref="sourceTag" label="Source Tag:" />
          <Input type="text" ref="invoiceId" label="Invoice Id:" />
          <Input type="text" ref="amount" label="Amount:" required />
          <Input type="text" ref="currency" label="Currency:" required />
          <Input type="textarea" ref="memo" label="Memo:" />
          <Button bsStyle="primary" type="submit">Submit Payment</Button>
          <br />
          <br />
          {this.state.showProgressBar ? progressBar : null}
        </form>
      </div>
    );
  }
});

module.exports = PaymentCreate;
