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
        <button onClick={this.handleExpand} type="button" className="btn btn-default pull-left" aria-label="Left Align">
          <span className="glyphicon glyphicon-expand" aria-hidden="true"></span>
        </button>
        <Branding brandName={this.props.brandName} />
        <Greeting className={"greeting-wrapper"} />
        {nav}
      </div>
    );
  }
});

module.exports = TopBar;
