"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;
var Dispatcher = require('../../dispatchers/dispatcher');

var Payment = React.createClass({
  propTypes: {
  },

  render: function() {
    return (
      <div>I am a payment id {this.props.id}</div>
    );
  }
});

module.exports = Payment;

