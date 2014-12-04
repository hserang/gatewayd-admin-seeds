"use strict";

var React = require('react');

var Branding = React.createClass({
  propTypes: {
    brandName: React.PropTypes.string
  },

  render: function() {
    return (
      <div className="navbar-header">
      <button
        type="button"
        className="navbar-toggle collapsed"
        data-toggle="collapse"
        data-target="#navbar"
        aria-expanded="false"
        aria-controls="navbar"></button>
      <a className="navbar-brand" href="/#/payments/outgoing/all">
        {this.props.brandName}
      </a>
      </div>
    );
  }
});

module.exports = Branding;
