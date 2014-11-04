"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;

var Payment = React.createClass({

  handleClick: function(e) {
    e.preventDefault();

  },

  render: function() {
    return (
      <li onClick={this.handleClick}>
      {this.props.timeStamp}
      {this.props.sourceAddress}
      {this.props.currency}
      {this.props.amount}
      <button className="btn">Done</button></li>
    );
  }
});

module.exports = Payment;

