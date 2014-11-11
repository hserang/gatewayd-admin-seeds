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
        <div className="row border-bottom">
          <div className="col-sm-3">
            Address: {this.props.sourceAddress}
          </div>
          <div className="col-sm-3">
          </div>
          <div className="col-sm-3">
            Currency: {this.props.currency} <br />
            Amount: {this.props.symbol}{this.props.amount}
          </div>
          <div className="col-sm-3">
            <button className="btn pull-right">Done</button>
          </div>
        </div>
        <div className="clearfix">
          <span className="pull-right">{this.props.timeStamp}</span>
        </div>
    </li>
    );
  }
});

module.exports = Payment;
