'use strict';

var React = require('react');
var Branding = require('../../shared/components/branding/branding.jsx');
var NavLinks = require('../../shared/components/nav-links/nav-links.jsx');
var Greeting = require('../../shared/components/greeting/greeting.jsx');

var TopBar = React.createClass({
  render: function() {
    var nav;

    if (this.props.setup.links.length > 0) {
      nav = (<NavLinks
          links={this.props.setup.links}
          className="nav navbar-nav navbar-right"/>)
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
