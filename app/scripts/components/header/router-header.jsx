var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav;

var session = require('../../session/models/session');

var RouterHeader = React.createClass({
  render: function() {
    return (
      <Navbar>
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            Gatewayd Basic
          </Link>
        </div>
        <Nav>
          <NavItem><Link to="/payments">Payments</Link></NavItem>
        </Nav>
        <span>
          Hello, {session.get('userModel').get('name')}
        </span>
      </Navbar>
    );
  }
});

module.exports = RouterHeader;
