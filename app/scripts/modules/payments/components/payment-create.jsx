'use strict';

var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Label = require('react-bootstrap').Label;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ProgressBar = require('react-bootstrap').ProgressBar;
var paymentActions = require('../actions');

var PaymentCreate = React.createClass({
  advanceProgressBar: function(amount) {
    if (this.state.progressBarPercentage + amount < 100) {
      this.setState({
        progressBarPercentage: this.state.progressBarPercentage + amount,
        progressBarStyle: 'primary'
      });
    }
  },

  formatInput: function(rawInputRef, type) {
    var formattedInput = rawInputRef.getValue().trim();

    return type === 'number' ? formattedInput * 1 : formattedInput;
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var _this = this;
    var payment = {
      address: this.formatInput(this.refs.address, 'string') || null,
      amount: this.formatInput(this.refs.amount, 'number') || null,
      currency: this.formatInput(this.refs.currency, 'string').toUpperCase() || null,
      destinationTag: this.formatInput(this.refs.destinationTag, 'number') || null,
      sourceTag: this.formatInput(this.refs.sourceTag, 'number') || null, // not implemented yet
      invoiceId: this.formatInput(this.refs.invoiceId, 'string') || null, // not implemented yet
      memo: this.formatInput(this.refs.memo, 'string') || null // not implemented yet
    };

    this.setState({
      disableForm: true,
      submitButtonLabel: 'Sending Payment...',
      progressBarLabel: '',
      progressBarPercentage: 0,
      showProgressBar: true
    });

    this.intervalToken = setInterval(function() {
      _this.advanceProgressBar(1);
    }, 400);

    paymentActions.sendPaymentAttempt(payment);
  },

  handleSuccess: function(payment) {
    clearInterval(this.intervalToken);
    this.setState({
      submitButtonLabel: 'Payment Successfully Sent',
      progressBarPercentage: 100,
      progressBarStyle: 'success'
    });
  },

  handleError: function(errorMessage) {
    clearInterval(this.intervalToken);
    this.setState({
      disableForm: false,
      submitButtonLabel: 'Re-Submit Payment?',
      progressBarLabel: 'Error: ' + errorMessage,
      progressBarPercentage: 100,
      progressBarStyle: 'warning'
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
    this.advanceProgressBar(25);
  },

  handleClose: function() {
    this.props.onSubmitSuccess();
  },

  getInitialState: function() {
    return {
      disableForm: false,
      submitButtonLabel: 'Submit Payment',
      showProgressBar: false,
      progressBarLabel: '',
      progressBarPercentage: 0,
      progressBarStyle: 'primary',
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
        <ProgressBar now={this.state.progressBarPercentage}
          label={this.state.progressBarLabel}
          bsStyle={this.state.progressBarStyle}
        />
        {this.state.showGraphLink ? graphLink : null}
      </div>
    );

    return (
      <div>
        <h2>Send Payment</h2>
        <form onSubmit={this.handleSubmit}>
          <Label bsStyle="info">Required</Label>
          <Input type="text" ref="address" label="Destination Address:"
            disabled={this.state.disableForm} autoFocus={true} hasFeedback />
          <Row>
            <Col xs={6}>
              <Label bsStyle="info">Required</Label>
              <Input type="tel" ref="amount" label="Amount:"
                disabled={this.state.disableForm} />
            </Col>
            <Col xs={6}>
              <Label bsStyle="info">Required</Label>
              <Input type="text" ref="currency" label="Currency:"
                disabled={this.state.disableForm} />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Input type="tel" ref="destinationTag" label="Destination Tag:"
                disabled={this.state.disableForm} />
            </Col>
            <Col xs={6}>
              <Input type="tel" ref="sourceTag" label="Source Tag:"
                disabled={this.state.disableForm} />
            </Col>
          </Row>
          <Input type="text" ref="invoiceId" label="Invoice Id:"
            disabled={this.state.disableForm} />
          <Input type="textarea" ref="memo" label="Memo:"
            disabled={this.state.disableForm} />
          <Button className="pull-right" bsStyle="primary" bsSize="large" type="submit"
            disabled={this.state.disableForm} block>{this.state.submitButtonLabel}
          </Button>
          <br />
          <br />
          <br />
          {this.state.showProgressBar ? progressBar : null}
        </form>
      </div>
    );
  }
});

module.exports = PaymentCreate;
