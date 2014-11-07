'use strict';

var React = require('react');
var Navigation = require('react-router').Navigation;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var paymentActions = require('../actions');

var PaymentHistory = React.createClass({
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
      currency: this.formatInput(this.refs.currency, 'string'),
      destinationTag: this.formatInput(this.refs.destinationTag, 'number') || null,
      sourceTag: this.formatInput(this.refs.sourceTag, 'number') || null, // not implemented yet
      invoiceId: this.formatInput(this.refs.invoiceId, 'string') || null, // not implemented yet
      memo: this.formatInput(this.refs.memo, 'string') || null // not implemented yet
    };

    paymentActions.sendPayment(payment);
  },

  dispatchAddNewSentPayment: function(payment) {
    paymentActions.addNewSentPayment(payment);
  },

  componentDidMount: function() {
    var _this = this;

    this.props.model.on('addNewSentPayment', this.dispatchAddNewSentPayment);
  },

  componentWillUnmount: function() {
    this.props.model.off('addNewSentPayment');
  },

  render: function() {
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
        </form>
      </div>
    );
  }
});

module.exports = PaymentHistory;
