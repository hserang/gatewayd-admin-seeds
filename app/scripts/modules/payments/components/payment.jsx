"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;

var Payment = React.createClass({
  handleItemClick: function(id) {
    this.props.itemClickHandler(id);
  },

  handleButtonClick: function(id, e) {
    e.stopPropagation();

    this.props.buttonClickHandler(id);
  },

  render: function() {
    var doneButton, address;
    var classes = 'list-group-item';
    var rippleGraphLink = 'http://www.ripplecharts.com/#/graph/' + this.props.transactionHash;

    if (this.props.isNew) {
      classes += ' highlight';
    }

    if (this.props.direction === 'from-ripple') {
      address = ['From', this.props.fromAddress];
    } else {
      address = ['To', this.props.toAddress];
    }


    //make a done button component and put this logic there!!
    if (this.props.state === 'incoming') {
      doneButton = <button onClick={this.handleButtonClick.bind(this, this.props.id)} className="btn pull-right">Done</button>;
    } else {
      doneButton = null;
    }

    return (
      <li className={classes} onClick={this.handleItemClick.bind(this, this.props.id)}>
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
        <div className="row">
          <div className="col-sm-8">
            {address[0]} Address: {address[1]}
          </div>
          <div className="col-sm-4">
            {doneButton}
          </div>
        </div>
        <div className="row border-bottom">
          <div className="col-sm-12">
            <a href={rippleGraphLink}>Ripple Graph Link</a>
          </div>
        </div>
        <div className="clearfix">
          <span className="pull-left">{this.props.timeStamp}</span>
        </div>
      </li>
    );
  }
});

module.exports = Payment;
