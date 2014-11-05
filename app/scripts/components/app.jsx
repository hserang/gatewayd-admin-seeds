"use strict";

var React = require('react');

var Navigation = require('react-router').Navigation;

var session = require('../session/models/session');
var sessionActions = require('../session/actions');

var RouterHeader = require('./header/router-header.jsx');
var Footer = require('./footer/footer.jsx');

require('react-bootstrap');

var redirectToLogin = function() {
  if (!session.isLoggedIn()) {
    this.transitionTo('/login');
  }
};

var attemptSessionRestoration = function() {
  sessionActions.restore();
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
        <div className="container">
          <RouterHeader />
          {this.props.activeRouteHandler()}
          <Footer />
        </div>
      )
    }
});

module.exports = App;
