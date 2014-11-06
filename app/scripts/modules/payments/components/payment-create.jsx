'use strict';

var React = require('react');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var paymentActions = require('../actions');

var PaymentHistory = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var payment = {
      address: this.refs.address.getValue().trim(),
      amount: this.refs.amount.getValue().trim(),
      currency: this.refs.currency.getValue().trim(),
      destinationTag: this.refs.destinationTag.getValue().trim() || null,
      sourceTag: this.refs.sourceTag.getValue().trim() || null, // exists?
      invoiceId: this.refs.invoiceId.getValue().trim() || null // exists?
    };

    paymentActions.sendPayment(payment);
  },

  componentDidMount: function() {
    this.props.model.on('change', function() {
      // ???
    });
  },

  componentWillUnmout: function() {
    this.props.model.off('change');
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
          <Input type="textarea" label="Memo:" />
          <Button bsStyle="primary" type="submit">Submit Payment</Button>
        </form>
      </div>
    );
  }
});

module.exports = PaymentHistory;
