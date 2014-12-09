"use strict";

var React = require('react');
var Branding = require('./branding.jsx');
var NavLinks = require('./nav-links.jsx');
var Greeting = require('./greeting.jsx');

var TopBar = React.createClass({
  getDefaultProps: function() {
    return {
      brandName: 'Hello World',
      wrapperClassName: 'navbar',
      links: [{
        text: 'Login',
        href: '/login'
      }]
    };
  },

  propTypes: {
    links: React.PropTypes.array,
    brandName: React.PropTypes.string,
    wrapperClassName: React.PropTypes.string
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
          navLinksClassName="nav navbar-nav navbar-right"
        />
      );
    }

    return (
      <div className={this.props.wrapperClassName}>
        <a href="#" onClick={this.handleExpand} className="button-sidebar">
          <span className="glyphicon glyphicon-th-list" aria-hidden="true"></span>
        </a>
        <Branding
          brandName={this.props.brandName}
          wrapperClassName={this.props.brandingClassName}
        />
        <Greeting greetingClassName={"greeting-wrapper"} />
        {nav}
      </div>
    );
  }
});

module.exports = TopBar;
