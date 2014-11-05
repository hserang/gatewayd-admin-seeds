var session = require('../../session/models/session');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;

var TopBar = React.createClass({
  getDefaultProps: function() {
    //Sample config. TODO: pass it into props
    var defaults = {
      brandName: "Your Brand Here",
      wrapperClass: "top-bar",
      links: [{
        text: "link1",
        href: "/"
      },
      {
        text: "link2",
        href: "/"
      },
      {
        text: "link3",
        href: "/"
      }]
    };

    return {setup: defaults};
  },

  getLinks: function(links) {
    var items = links.map(function(link, i) {
      return(
        <li><Link key={i++} to={link.href}>{link.text}</Link></li>
      );
    });

    return items;
  },

  render: function() {
    var links = this.getLinks(this.props.setup.links);

    return (
      <div className={this.props.setup.wrapperClass}>
        <Navbar>
          <div className="navbar-header">
            <a className="navbar-brand">{this.props.setup.brandName}</a>
          </div>
          <Nav>{links}</Nav>
        </Navbar>
      </div>
    );
  }
});

module.exports = TopBar;
