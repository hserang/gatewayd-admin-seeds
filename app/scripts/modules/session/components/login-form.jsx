'use strict';

var React = require('react');

var Navigation = require('react-router').Navigation;

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var Session = require('../models/session');
var SessionActions = require('../actions');

var LoginForm = React.createClass({
  mixins: [Navigation],

  handleSubmit: function(e) {
    e.preventDefault();

    // var name = this.refs.name.getValue().trim();
    var name = 'admin';
    var sessionKey = this.refs.sessionKey.getValue().trim();

    if (!name || !sessionKey) {
      return false;
    }

    SessionActions.login(name, sessionKey);
  },

  componentDidMount: function() {
    var _this = this;
    Session.on('loggedIn', function() {
      _this.transitionTo('payments');
    });
  },

  componentWillUnmout: function() {
    Session.off('loggedIn');
  },

  render: function() {
    return (
      <form role="form" className="col-xs-12" onSubmit={this.handleSubmit}>
        <Input type="password" label="Enter key:" ref="sessionKey" autoFocus={true} required />
        <Button type="submit" bsStyle="primary">Log In</Button>
      </form>
    );
  }
});

module.exports = LoginForm;
