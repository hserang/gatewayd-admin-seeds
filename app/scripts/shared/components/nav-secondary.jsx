"use strict";

var React = require('react');
var Navigation = require('react-router').Navigation;

var session = require('../modules/session/models/session');
var sessionActions = require('../modules/session/actions');

var NavLinks = require('../shared/components/nav-links/nav-links.jsx');
var NavSecondary = React.createClass({

  getDefaultProps: function() {
    return {
      links: [{
        text: 'Received',
        href: '/payments/incoming'
      },
      {
        text: 'Sent',
        href: '/payments/outgoing'
      }],
      wrapperClassName: 'foo',
      className: 'nav-secondary'
    };
  },

  render: function() {
    return (
      <div className={this.props.wrapperClassName}>
        <NavLinks
          links={this.props.links}
          className={this.props.className}/>
      </div>
    );
  }
});

module.exports = NavSecondary;
