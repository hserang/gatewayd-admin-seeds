var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var Link = require('react-router').Link;

var NavLinks = React.createClass({
  propTypes: {
    links: React.PropTypes.array
  },

  getLinks: function(links) {
    var items = links.map(function(link, i) {
      return(
        <li>
          <Link key={i++} to={link.href}>
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
      <Navbar>
        <Nav>
          {links}
        </Nav>
      </Navbar>
    );
  }
});

module.exports = NavLinks;
