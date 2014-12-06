"use strict";

var React = require('react');

var WalletEntry = React.createClass({
  propTypes: {
    currency: React.PropTypes.string,
    amount: React.PropTypes.number,
    counterpary: React.PropTypes.string
  },

  render: function() {
    return (
      <li className="list-group-item">
        <div className="row border-bottom">
          <div className="col-sm-2">
            {this.props.currency}
          </div>
          <div className="col-sm-2 col-sm-offset-1">
            {this.props.amount}
          </div>
        </div>
      </li>
    );
  }
});

module.exports = WalletEntry;
