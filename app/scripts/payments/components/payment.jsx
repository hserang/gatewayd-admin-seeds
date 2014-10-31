"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;

var Payment = React.createClass({

  handleClick: function(e) {
    e.preventDefault();
    console.log("asdf", this);

  },

  render: function() {
    return (
      <div onClick={this.handleClick}>I am a payment id {this.props.id}<button>delete</button></div>
    );
  }
});

module.exports = Payment;

