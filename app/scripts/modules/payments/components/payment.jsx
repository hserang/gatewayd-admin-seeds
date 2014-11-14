"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;

var Payment = React.createClass({

  handleClick: function(id) {
    this.props.clickHandler(id);
  },

  render: function() {
    var doneButton = <button onClick={this.handleClick.bind(this, this.props.id)} className="btn pull-right">Done</button>;

    return (
      <li className="list-group-item">
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
          Status: {this.props.state}
          {this.props.state === 'incoming' ? doneButton : null}
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
