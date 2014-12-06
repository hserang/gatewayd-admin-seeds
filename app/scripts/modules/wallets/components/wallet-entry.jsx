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
          <div className="col-sm-3">
            {this.props.currency}
          </div>
          <div className="col-sm-3 col-sm-offset-2">
            {this.props.amount}
          </div>
        </div>
      </li>
    );
  }
});

module.exports = WalletEntry;
