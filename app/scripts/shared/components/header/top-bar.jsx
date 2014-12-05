"use strict";

var React = require('react');
var Branding = require('./branding.jsx');
var NavLinks = require('./nav-links.jsx');
var Greeting = require('./greeting.jsx');

/*
  Sample setup object:

    {
      brandName: 'Hello World',
      wrapperClass: 'navbar-inverse navbar-fixed-top top-bar container-fluid',
      links: [
        {
          text: "Login"
          href: "/login"
        },
        {
          text: "Main"
          href: "/"
        },
        {
          text: "Logout"
          href: "/logout"
        }
      ]
    }
*/

var TopBar = React.createClass({
  propTypes: {
    setup: React.PropTypes.object
  },

  render: function() {
    var nav;

    if (this.props.setup.links.length) {
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
        <Greeting className={"greeting-wrapper"} />
        {nav}
      </div>
    );
  }
});

module.exports = TopBar;
