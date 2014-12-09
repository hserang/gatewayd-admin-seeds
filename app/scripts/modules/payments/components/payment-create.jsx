"use strict";

var _ = require('lodash');
var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Label = require('react-bootstrap').Label;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var paymentActions = require('../actions');

var PaymentCreate = React.createClass({
  validationMap: {
    valid: 'success',
    invalid: 'warning'
  },

  typeMap: {
    address: 'string',
    amount: 'number',
    currency: 'string',
    destinationTag: 'number',
    sourceTag: 'number',
    invoiceId: 'string',
    memo: 'string'
  },

  formatInput: function(rawInputRef, type) {
    var formattedInput = rawInputRef.getValue().trim();

    if (!formattedInput) {
      return null;
    }

    return type === 'number' ? formattedInput * 1 : formattedInput;
  },

  showFieldValidationResult: function(isValid, fieldName, errorMessage) {
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

    if (fieldName === 'address') {
      this.setState({
        disableAddressField: false,
        disableSubmitButton: false
      });
    }
  },

  validateField: function(fieldName, shouldForceValidate) {
    var fieldValue = this.formatInput(this.refs[fieldName], this.typeMap[fieldName]);
    var clearFieldValidation = {};

    clearFieldValidation[fieldName] = {};

    this.setState(clearFieldValidation);

    if (fieldValue !== null || shouldForceValidate) {
      this.props.model.validateField(fieldName, fieldValue);
    }
  },

  validateAddress: function(shouldForceValidate) {
    var addressFieldValue = this.formatInput(this.refs.address, this.typeMap.address);

    this.setState({
      address: {}
    });

    if (addressFieldValue !== null || shouldForceValidate) {
      this.setState({
        disableAddressField: true,
        disableSubmitButton: true
      });

      this.props.model.validateAddress(addressFieldValue);
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var _this = this;
    var payment = {
      address: this.formatInput(this.refs.address, this.typeMap.address),
      amount: this.formatInput(this.refs.amount, this.typeMap.amount),
      currency: this.formatInput(this.refs.currency, this.typeMap.currency),
      destinationTag: this.formatInput(this.refs.destinationTag, this.typeMap.destinationTag),
      sourceTag: this.formatInput(this.refs.sourceTag, this.typeMap.sourceTag),
      invoiceId: this.formatInput(this.refs.invoiceId, this.typeMap.invoiceId),
      memo: this.formatInput(this.refs.memo, this.typeMap.memo)
    };

    this.setState({
      disableForm: true,
      submitButtonLabel: 'Sending Payment...',
    });

    // force validate all fields, even if null
    this.validateAddress(true);
    this.validateField('amount', true);
    this.validateField('currency', true);
    this.validateField('destinationTag', true);
    this.validateField('sourceTag', true);
    this.validateField('invoiceId', true);
    this.validateField('memo', true);

    paymentActions.sendPaymentAttempt(payment);
  },

  handleClose: function() {
    this.props.onSubmitSuccess();
  },

  handleError: function() {
    this.setState({
      disableForm: false,
      submitButtonLabel: 'Re-Submit Payment?',
    });
  },

  dispatchSendPaymentComplete: function(model, data) {
    this.hideForm();

    paymentActions.sendPaymentComplete(data.payment);
  },

  hideForm: function() {
    this.props.onRequestHide();
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
    };
  },


  componentDidMount: function() {
    this.props.model.on('validationComplete', this.showFieldValidationResult);
    this.props.model.on('sync', this.dispatchSendPaymentComplete);
    this.props.model.on('error invalid', this.handleError);
  },

  componentWillUnmount: function() {
    this.props.model.off('validationComplete sync error invalid');
  },

  render: function() {
    return (
      <Modal
        title="Send Payment"
        backdrop={true}
        onRequestHide={this.hideForm}
        animation={false}
      >
        <div className="modal-body">
          <form onSubmit={this.handleSubmit}>
            <Input type="text" ref="address"
              label={<div><Label bsStyle="info">Required</Label> Destination Address: </div>}
              bsStyle={this.validationMap[this.state.address.isValid]}
              disabled={this.state.disableForm || this.state.disableAddressField}
              autoFocus={true} onBlur={this.validateAddress.bind(this, false)} />
            <Label bsStyle="warning">{this.state.address.errorMessage}</Label>
            <Row>
              <Col xs={6}>

                <Input type="tel" ref="amount"
                  label={<div><Label bsStyle="info">Required</Label> Amount: </div>}
                  bsStyle={this.validationMap[this.state.amount.isValid]}
                  disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'amount', false)} />
                <Label bsStyle="warning">{this.state.amount.errorMessage}</Label>
              </Col>
              <Col xs={6}>
                <Input type="text" ref="currency"
                  label={<div><Label bsStyle="info">Required</Label> Currency: </div>}
                  bsStyle={this.validationMap[this.state.currency.isValid]}
                  disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'currency', false)} />
                <Label bsStyle="warning">{this.state.currency.errorMessage}</Label>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Input type="tel" ref="destinationTag"
                  label="Destination Tag:"
                  bsStyle={this.validationMap[this.state.destinationTag.isValid]}
                  disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'destinationTag', false)} />
                <Label bsStyle="warning">{this.state.destinationTag.errorMessage}</Label>
              </Col>
              <Col xs={6}>
                <Input type="tel" ref="sourceTag"
                  label="Source Tag:"
                  bsStyle={this.validationMap[this.state.sourceTag.isValid]}
                  disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'sourceTag', false)} />
                <Label bsStyle="warning">{this.state.sourceTag.errorMessage}</Label>
              </Col>
            </Row>
            <Input type="text" ref="invoiceId"
              label="Invoice Id:"
              bsStyle={this.validationMap[this.state.invoiceId.isValid]}
              disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'invoiceId', false)} />
            <Label bsStyle="warning">{this.state.invoiceId.errorMessage}</Label>
            <Input type="textarea" ref="memo"
              label="Memo:"
              bsStyle={this.validationMap[this.state.memo.isValid]}
              disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'memo', false)} />
            <Label bsStyle="warning">{this.state.memo.errorMessage}</Label>
            <Button className="pull-right" bsStyle="primary" bsSize="large" type="submit"
              disabled={this.state.disableForm || this.state.disableSubmitButton}
              block>
              {this.state.submitButtonLabel}
            </Button>
          </form>
        </div>
      </Modal>
    );
  }
});

module.exports = PaymentCreate;
