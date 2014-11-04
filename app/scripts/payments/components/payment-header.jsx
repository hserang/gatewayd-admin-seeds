var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav;

var PaymentHeader = React.createClass({
  render: function() {
    return (
      <Navbar>
        <div className="navbar-header">
        </div>
        <Nav>
          <NavItem><Link to="/payments">Incoming Payments</Link></NavItem>
          <NavItem><Link to="/payments">Create Payment</Link></NavItem>
          <NavItem><Link to="/payments">Payments History</Link></NavItem>
        </Nav>
      </Navbar>
    );
  }
});

module.exports = PaymentHeader;
