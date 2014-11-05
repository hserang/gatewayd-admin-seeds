'use strict;'

var _ = require('lodash');
var React = require('react');

var Router = require('react-router');
var CurrentPath = Router.CurrentPath;
var Navigation = Router.Navigation;

var session = require('../models/session');
var sessionActions = require('../actions');
var LoginForm = require('./login-form.jsx');

var toLogin = function() {
  return <LoginForm />;
};

var toLogout = function() {
  sessionActions.logout();
  this.transitionTo('/login');
};

var switchState = function(path) {
  var loginState = {
    '/login': toLogin,
    '/logout': toLogout
  };

  if (!_.isUndefined(loginState[path])) {
    return loginState[path].call(this);
  } else {
    return false;
  }
};

var Session = React.createClass({
  mixins: [CurrentPath, Navigation],
  render: function() {
    return (
      <div>
        {switchState.call(this, this.getCurrentPath())}
      </div>
    );
  }
});

module.exports = Session;
