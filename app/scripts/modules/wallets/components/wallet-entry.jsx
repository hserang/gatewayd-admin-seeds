"use strict";

var React = require('react');

var WalletEntry = React.createClass({
  propTypes: {
    key: React.PropTypes.string,
    currency: React.PropTypes.string,
    value: React.PropTypes.string,
    counterpary: React.PropTypes.string
  },

  render: function() {
    return (
      <li className="list-group-item wallet">
        <div className="row">
          <div className="col-sm-3 col-xs-6">
            {this.props.currency}
          </div>
          <div className="col-sm-3 col-xs-6 col-sm-offset-1">
            {this.props.value}
          </div>
        </div>
      </li>
    );
  }
});

module.exports = WalletEntry;
