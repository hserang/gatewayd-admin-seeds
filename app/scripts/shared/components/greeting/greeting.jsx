var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var session = require('../../../session/models/session');

var Greeting = React.createClass({
  loggedIn: function() {
    return (
      <div>
      Hello, {session.get('userModel').get('name')}
      <Link to="/logout">
      Logout
      </Link>
      </div>
    );
  },

  loggedOut: function() {
    return <br />;
  },

  displayLogState: function(loginState) {
    var options = {
      'loggedIn': this.loggedIn,
      'loggedOut': this.loggedOut
    };

    if (!_.isUndefined(options[loginState])) {
      return options[loginState]();
    } else {
      return <br />;
    }
  },

  render: function() {
    return (
      <div>
        {this.displayLogState(session.getLogState())}
      </div>
    );
  }
});

module.exports = Greeting;
