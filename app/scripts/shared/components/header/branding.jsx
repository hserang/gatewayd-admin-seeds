"use strict";

var React = require('react');

var Branding = React.createClass({
  getDefaultProps: function() {
    return {
      brandName: "foo",
      brandingClass: "header-branding"
    };
  },

  propTypes: {
    brandName: React.PropTypes.string
  },

  render: function() {
    return (
      <div className={this.props.class}>
        <a className="navbar-brand" href="/">
          {this.props.brandName}
        </a>
      </div>
    );
  }
});

module.exports = Branding;
