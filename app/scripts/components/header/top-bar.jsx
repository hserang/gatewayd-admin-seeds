var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;

//Sample config. TODO: pass it into props
var config = {
  brandName: "Your Brand Here",
  links: [
    {
      text: "link1",
      href: "fakeref1"
    },
    {
      text: "link2",
      href: "fakeref2"
    },
    {
      text: "link3",
      href: "fakeref3"
    }
  ]
};

var TopBar = React.createClass({
      getInitialState: function() {
        return config;
      },

      getLinks: function(links) {
        var items = links.map(function(link, i) {
          return(
            <NavItem key={i+1} href={link.href}>{link.text}</NavItem>
          );
        });

        return items;
      },

      render: function() {
        var links = this.getLinks(this.state.links);

        return (
          <div className="top-bar">
            <Navbar>
              <div className="navbar-header">
                <a className="navbar-brand">
                  {this.state.brandName}
                </a>
              </div>
              <Nav>
                {links}
              </Nav>
            </Navbar>
          </div>
        );
      }
});

module.exports = TopBar;
