"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;

var Payment = React.createClass({

  handleClick: function(id) {
    this.props.clickHandler(id);
  },

  render: function() {
    var doneButton, address;

    if (this.props.direction === 'from-ripple') {
      address = ['From', this.props.fromAddress];
    } else {
      address = ['To', this.props.toAddress];
    }

    var classes = 'list-group-item';
    if (this.props.isNew) {
      classes += ' highlight';
    }

    //make a done button component and put this logic there!!
    if (this.props.state === 'incoming') {
      doneButton = <button onClick={this.handleClick.bind(this, this.props.id)} className="btn pull-right">Done</button>;
    } else {
      doneButton = null;
    }

    return (
      <li className={classes}>
        <div className="row">
          <div className="col-sm-4">
            To Currency: {this.props.toCurrency} {this.props.toAmount}
          </div>
          <div className="col-sm-1">
          </div>
          <div className="col-sm-4">
            From Currency: {this.props.fromCurrency} {this.props.fromAmount}
          </div>
          <div className="col-sm-3">
            Status: {this.props.state}
          </div>
        </div>
        <div className="row border-bottom">
          <div className="col-sm-6">
            {address[0]} Address: {address[1]}
          </div>
          <div className="col-sm-6">
            {doneButton}
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
