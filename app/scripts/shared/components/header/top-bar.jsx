"use strict";

var React = require('react');
var Branding = require('./branding.jsx');
var NavLinks = require('./nav-links.jsx');
var Greeting = require('./greeting.jsx');

var TopBar = React.createClass({
  getDefaultProps: function() {
    return {
      brandName: "Hello World",
      wrapperClass: 'navbar',
      links: [{
        text: "Login",
        href: "/login"
      }]
    };
  },

  propTypes: {
    links: React.PropTypes.array,
    brandName: React.PropTypes.string,
    wrapperClass: React.PropTypes.string
  },

  handleExpand: function(e) {
    e.preventDefault();
    this.props.expandSidebar();
  },

  render: function() {
    var nav;

    if (this.props.links.length) {
      nav = (
        <NavLinks
          links={this.props.links}
          className="nav navbar-nav navbar-right"
        />
      );
    }

    return (
      <div className={this.props.wrapperClass}>
        <a href="#" onClick={this.handleExpand} className="button-sidebar">
          <span className="glyphicon glyphicon-expand" aria-hidden="true"></span>
        </a>
        <Branding
          brandName={this.props.brandName}
          wrapperClass={this.props.brandingClass}
        />
        <Greeting className={"greeting-wrapper"} />
        {nav}
      </div>
    );
  }
});

module.exports = TopBar;
