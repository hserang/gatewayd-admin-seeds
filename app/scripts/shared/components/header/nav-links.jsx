"use strict";

var React = require('react');
var Link = require('react-router').Link;

/*
  Sample links array:

  [
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
*/

var NavLinks = React.createClass({
  propTypes: {
    links: React.PropTypes.array,
    className: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      className: "nav navbar-nav"
    };
  },

  getLinks: function(links) {
    var items = links.map(function(link, i) {
      return (
        <li key={i++}>
          <Link to={link.href}>
            {link.text}
          </Link>
        </li>
      );
    });

    return items;
  },

  render: function() {
    var links = this.getLinks(this.props.links);

    return (
      <ul className={this.props.className}>
        {links}
      </ul>
    );
  }
});

module.exports = NavLinks;
