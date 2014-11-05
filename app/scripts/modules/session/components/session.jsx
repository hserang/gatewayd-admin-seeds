'use strict;'

var _ = require('lodash');
var React = require('react');

var Router = require('react-router');
var CurrentPath = Router.CurrentPath;
var Navigation = Router.Navigation;

var session = require('../models/session');
var sessionActions = require('../actions');
var LoginForm = require('./login-form.jsx');

var Session = React.createClass({
  mixins: [CurrentPath, Navigation],

  toLogin: function() {
    return <LoginForm />;
  },

  toLogout: function() {
    sessionActions.logout();
    this.transitionTo('/login');
  },

  switchState: function(path) {
    var loginState = {
      '/login': this.toLogin,
      '/logout': this.toLogout
    };

    if (!_.isUndefined(loginState[path])) {
      return loginState[path]();
    } else {
      return false;
    }
  },

  render: function() {
    return (
      <div>
        {this.switchState(this.getCurrentPath())}
      </div>
    );
  }
});

module.exports = Session;
