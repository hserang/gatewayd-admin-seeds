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
    valid: 'success',
    invalid: 'warning'
  },

  validateAddress: function(e) {
    this.props.model.validateAddress(this.formatInput(this.refs.address, 'string'));
  },

  validateAmount: function() {
    this.props.model.validateAmount(this.formatInput(this.refs.amount, 'number'));
  },

  validateCurrency: function() {
    this.props.model.validateCurrency(this.formatInput(this.refs.currency, 'string'));
  },

  validateDestinationTag: function() {
    this.props.model.validateDestinationTag(this.formatInput(this.refs.destinationTag, 'number'));
  },

  validateSourceTag: function() {
    this.props.model.validateSourceTag(this.formatInput(this.refs.sourceTag, 'number'));
  },

  validateInvoiceId: function() {
    this.props.model.validateInvoiceId(this.formatInput(this.refs.invoiceId, 'string'));
  },

  validateMemo: function() {
    this.props.model.validateMemo(this.formatInput(this.refs.memo, 'string'));
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

    if (!formattedInput) {
      return null;
    }

    return type === 'number' ? formattedInput * 1 : formattedInput;
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var _this = this;
    var payment = {
      address: this.formatInput(this.refs.address, 'string'),
      amount: this.formatInput(this.refs.amount, 'number'),
      currency: this.formatInput(this.refs.currency, 'string'),
      destinationTag: this.formatInput(this.refs.destinationTag, 'number'),
      sourceTag: this.formatInput(this.refs.sourceTag, 'number'), // not implemented yet
      invoiceId: this.formatInput(this.refs.invoiceId, 'string'), // not implemented yet
      memo: this.formatInput(this.refs.memo, 'string') // not implemented yet
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

  handleFieldValidation: function(isValid, fieldName, errorMessage) {
    if (isValid) {
      var validField = {};

      validField[fieldName] = {isValid: 'valid'};

      this.setState(validField);
    } else {
      var invalidField = {};

      invalidField[fieldName] = {
        isValid: 'invalid',
        errorMessage: errorMessage
      };

      this.setState(invalidField);
    }
  },

  getInitialState: function() {
    return {
      address: {},
      amount: {},
      currency: {},
      destinationTag: {},
      sourceTag: {},
      invoiceId: {},
      memo: {},
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
    this.props.model.on('validationComplete', this.handleFieldValidation);
    this.props.model.on('sync', this.handleSync);
    // this.props.model.on('sendPaymentSuccess', this.handleSuccess);
    this.props.model.on('error', this.handleError);
    // this.props.model.on('sendPaymentComplete', this.dispatchSendPaymentComplete);
    // this.props.model.on('pollingPaymentState', this.handlePolling);
  },

  componentWillUnmount: function() {
    this.props.model.off('validationComplete');
    this.props.model.off('sync');
    // this.props.model.off('sendPaymentSuccess');
    this.props.model.off('error');
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

          <Input type="text" ref="address"
            label={
              <span>
                <Label bsStyle="info">Required</Label> Destination Address: <Label bsStyle="warning">{this.state.address.errorMessage}</Label>
              </span>
            }
            bsStyle={this.validationMap[this.state.address.isValid]}
            disabled={this.state.disableForm} autoFocus={true} onBlur={this.validateAddress} />
          <Row>
            <Col xs={6}>

              <Input type="tel" ref="amount"
                label={
                  <span>
                    <Label bsStyle="info">Required</Label> Amount: <Label bsStyle="warning">{this.state.amount.errorMessage}</Label>
                  </span>}
                bsStyle={this.validationMap[this.state.amount.isValid]}
                disabled={this.state.disableForm} onBlur={this.validateAmount} />
            </Col>
            <Col xs={6}>
              <Input type="text" ref="currency"
                label={
                  <span>
                    <Label bsStyle="info">Required</Label> Currency: <Label bsStyle="warning">{this.state.currency.errorMessage}</Label>
                  </span>
                }
                bsStyle={this.validationMap[this.state.currency.isValid]}
                disabled={this.state.disableForm} onBlur={this.validateCurrency} />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Input type="tel" ref="destinationTag"
                label={
                  <span>
                    Destination Tag: <Label bsStyle="warning">{this.state.destinationTag.errorMessage}</Label>
                  </span>
                }
                bsStyle={this.validationMap[this.state.destinationTag.isValid]}
                disabled={this.state.disableForm} onBlur={this.validateDestinationTag} />
            </Col>
            <Col xs={6}>
              <Input type="tel" ref="sourceTag"
                label={
                  <span>
                    Source Tag: <Label bsStyle="warning">{this.state.sourceTag.errorMessage}</Label>
                  </span>
                }
                bsStyle={this.validationMap[this.state.sourceTag.isValid]}
                disabled={this.state.disableForm} onBlur={this.validateSourceTag} />
            </Col>
          </Row>
          <Input type="text" ref="invoiceId"
            label={
              <span>
                Invoice Id: <Label bsStyle="warning">{this.state.invoiceId.errorMessage}</Label>
              </span>
            }
            bsStyle={this.validationMap[this.state.invoiceId.isValid]}
            disabled={this.state.disableForm} onBlur={this.validateInvoiceId} />
          <Input type="textarea" ref="memo"
            label={
              <span>
                Memo: <Label bsStyle="warning">{this.state.memo.errorMessage}</Label>
              </span>
            }
            bsStyle={this.validationMap[this.state.memo.isValid]}
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
