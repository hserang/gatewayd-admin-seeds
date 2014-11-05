"use strict";

var React = require('react');
var Navigation = require('react-router').Navigation;

var session = require('../session/models/session');
var sessionActions = require('../session/actions');
var RouterHeader = require('./header/top-bar.jsx');

require('react-bootstrap');

var redirectToLogin = function() {
  if (!session.isLoggedIn()) {
    this.transitionTo('/login');
  }
};

var attemptSessionRestoration = function() {
  sessionActions.restore();
};

var topBarConfig = {
  brandName: "Gatewayd Basic",
  wrapperClass: "top-bar container-fluid",
  links: [
    {
      text: "logout",
      href: "/logout"
    }
  ]
};

var App =
  React.createClass({
    mixins: [Navigation],

    render:function(){
      if (!session.get('lastLogin')) {
        attemptSessionRestoration();
        redirectToLogin.call(this);
      }

      return (
        <div>
          <RouterHeader setup={topBarConfig} />
          <div className="container">
            {this.props.activeRouteHandler()}
          </div>
        </div>
      )
    }
});

module.exports = App;
