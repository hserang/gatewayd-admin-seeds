"use strict";

var React = require('react');
var Branding = require('./branding.jsx');
var NavLinks = require('./nav-links.jsx');
var Greeting = require('./greeting.jsx');

var TopBar = React.createClass({
  propTypes: {
    setup: React.PropTypes.object
  },

  render: function() {
    var nav;

    if (this.props.setup.links.length > 0) {
      nav = (
        <NavLinks
          links={this.props.setup.links}
          className="nav navbar-nav navbar-right"
        />
      );
    }

    return (
      <div className={this.props.setup.wrapperClass}>
        <Branding brandName={this.props.setup.brandName} />
        <Greeting />
        {nav}
      </div>
    );
  }
});

module.exports = TopBar;
