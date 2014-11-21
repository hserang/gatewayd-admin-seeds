var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var session = require('../../../modules/session/models/session');

var Greeting = React.createClass({

  getDefaultProps: function() {
    //Sample config. TODO: pass it into props
    var defaults = {
          className: "greeting-wrapper"
        };

    return  defaults;
  },

  loggedIn: function() {
    return (
      <div className="greeting">
        <span className="welcome">
          Welcome {session.get('userModel').get('name')}
        </span>
        <Link to="/logout" className="link">Logout</Link>
      </div>
    );
  },

  loggedOut: function() {
    return <span></span>;
  },

  displayLogState: function(loginState) {
    var options = {
      'loggedIn': this.loggedIn,
      'loggedOut': this.loggedOut
    };

    if (!_.isUndefined(options[loginState])) {
      return options[loginState]();
    } else {
      return <span></span>;
    }
  },

  render: function() {
    return (
      <div className={this.props.className}>
        {this.displayLogState(session.getLogState())}
      </div>
    );
  }
});

module.exports = Greeting;
