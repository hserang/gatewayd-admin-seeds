var React = require('react');
var _ = require('lodash');

var Router = require('react-router');
var Link = Router.Link;

var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav;

var session = require('../../session/models/session');

var loggedIn = function() {
  return (
    <div>
      <div>
        <span>
          Hello, {session.get('userModel').get('name')}
        </span>
      </div>
      <div>
        <Link to="/logout">
          Logout
        </Link>
      </div>
    </div>
  );
};

var loggedOut = function() {
  return false;
};

var displayLogState = function(loginState) {
  console.log('?', loginState);
  var options = {
    'loggedIn': loggedIn,
    'loggedOut': loggedOut
  };

  if (!_.isUndefined(options[loginState])) {
    return options[loginState]();
  } else {
    return false;
  }
};

var RouterHeader = React.createClass({
  render: function() {
    return (
      <Navbar>
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            Gatewayd Basic
          </Link>
        </div>
        {displayLogState(session.getLogState())}
      </Navbar>
    );
  }
});

module.exports = RouterHeader;
