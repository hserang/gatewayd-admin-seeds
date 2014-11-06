"use strict";

var React = require('react');
var Navigation = require('react-router').Navigation;

var session = require('../modules/session/models/session');
var sessionActions = require('../modules/session/actions');

var NavLinks = require('../shared/components/nav-links/nav-links.jsx');

var Sidebar = React.createClass({

  getDefaultProps: function() {
    return {
      links: [{
        text: "Incoming Payments",
        href: "/payments/incoming"
      },
      {
        text: "Outgoing Payments",
        href: "/payments/outgoing"
      }],
      className: "sidebar"
    };
  },

  render: function() {
    return (
      <div className={this.props.className}>
        <NavLinks
          links={this.props.links}
          className="nav nav-sidebar"/>
      </div>
    );
  }
});

module.exports = Sidebar;;
