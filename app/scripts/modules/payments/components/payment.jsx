"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;

var Payment = React.createClass({

  handleClick: function(e) {
    e.preventDefault();
    console.log("clicked on payment item");
  },

  render: function() {
    return (
      <li
          className="list-group-item"
          onClick={this.handleClick}>
        Date: {this.props.timeStamp}
        {this.props.sourceAddress}
        Currency: {this.props.currency}
        Amount: {this.props.symbol}{this.props.amount}
      <button className="btn">Done</button></li>
    );
  }
});

module.exports = Payment;
