var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav;

var RouterHeader = React.createClass({
  render: function() {
    return (
      <Navbar>
        <div className="navbar-header">
          <a className="navbar-brand">
            We have routing!
          </a>
        </div>
        <Nav>
          <NavItem><Link to="/">Fancy</Link></NavItem>
          <NavItem><Link to="/hellos2">Informal</Link></NavItem>
          <NavItem><Link to="/hellos3">Wild</Link></NavItem>
          <NavItem><Link to="/notFound">Do not click me</Link></NavItem>
        </Nav>
      </Navbar>
    );
  }
});

module.exports = RouterHeader;
