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
  validationMap: {
    untested: 'error', // change to primary when react-bootstrap updates or use custom styling
    valid: 'success',
    invalid: 'warning'
  },

  validateAddress: function() {
    console.log('validating address');
    this.setState({
      addressIsValid: 'valid'
    });
  },

  validateAmount: function() {
    console.log('validating amount');
    this.setState({
      amountIsValid: 'valid'
    });
  },

  validateCurrency: function() {
    console.log('validating currency');
    this.setState({
      currencyIsValid: 'valid'
    });
  },

  validateDestinationTag: function() {
    console.log('validating destination tag');
    this.setState({
      destinationTagIsValid: 'valid'
    });
  },

  validateSourceTag: function() {
    console.log('validating source tag');
    this.setState({
      sourceTagIsValid: 'valid'
    });
  },

  validateInvoiceId: function() {
    console.log('validating invoice id');
    this.setState({
      invoiceIdIsValid: 'valid'
    });
  },

  validateMemo: function() {
    console.log('validating memo');
    this.setState({
      memoIsValid: 'valid'
    });
  },

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
      addressIsValid: 'untested',
      amountIsValid: 'untested',
      currencyIsValid: 'untested',
      destinationTagIsValid: 'untested',
      sourceTagIsValid: 'untested',
      invoiceIdIsValid: 'untested',
      memoIsValid: 'untested',
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

    this.props.model.on('sync', this.handleSync);
    // this.props.model.on('sendPaymentSuccess', this.handleSuccess);
    this.props.model.on('invalid error', this.handleError);
    // this.props.model.on('sendPaymentComplete', this.dispatchSendPaymentComplete);
    // this.props.model.on('pollingPaymentState', this.handlePolling);
  },

  componentWillUnmount: function() {
    this.props.model.off('sync');
    // this.props.model.off('sendPaymentSuccess');
    this.props.model.off('invalid');
    // this.props.model.off('sendPaymentComplete');
    // this.props.model.off('pollingPaymentState');
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
            bsStyle={this.validationMap[this.state.addressIsValid]}
            disabled={this.state.disableForm} autoFocus={true} onBlur={this.validateAddress} />
          <Row>
            <Col xs={6}>
              <Label bsStyle="info">Required</Label>
              <Input type="tel" ref="amount" label="Amount:"
                bsStyle={this.validationMap[this.state.amountIsValid]}
                disabled={this.state.disableForm} onBlur={this.validateAmount} />
            </Col>
            <Col xs={6}>
              <Label bsStyle="info">Required</Label>
              <Input type="text" ref="currency" label="Currency:"
                bsStyle={this.validationMap[this.state.currencyIsValid]}
                disabled={this.state.disableForm} onBlur={this.validateCurrency} />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Input type="tel" ref="destinationTag" label="Destination Tag:"
                bsStyle={this.validationMap[this.state.destinationTagIsValid]}
                disabled={this.state.disableForm} onBlur={this.validateDestinationTag} />
            </Col>
            <Col xs={6}>
              <Input type="tel" ref="sourceTag" label="Source Tag:"
                bsStyle={this.validationMap[this.state.sourceTagIsValid]}
                disabled={this.state.disableForm} onBlur={this.validateSourceTag} />
            </Col>
          </Row>
          <Input type="text" ref="invoiceId" label="Invoice Id:"
            bsStyle={this.validationMap[this.state.invoiceIdIsValid]}
            disabled={this.state.disableForm} onBlur={this.validateInvoiceId} />
          <Input type="textarea" ref="memo" label="Memo:"
            bsStyle={this.validationMap[this.state.memoIsValid]}
            disabled={this.state.disableForm} onBlur={this.validateMemo} />
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
