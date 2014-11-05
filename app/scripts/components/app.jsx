"use strict";

var React = require('react');
var Navigation = require('react-router').Navigation;

var session = require('../modules/session/models/session');
var sessionActions = require('../modules/session/actions');
var RouterHeader = require('./header/top-bar.jsx');

require('react-bootstrap');

var topBarConfig = {
  brandName: 'Gatewayd Basic',
  wrapperClass: 'top-bar container-fluid',
  links: [
    {
      text: 'To Ripple Network',
      href: '/payments'
    },
    {
      text: 'To External Account',
      href: '/payments'
    },
    {
      text: 'logout',
      href: '/logout'
    }
  ]
};

var App =
  React.createClass({
    mixins: [Navigation],

    redirectToLogin: function() {
      if (!session.isLoggedIn()) {
        this.transitionTo('/login');
      }
    },

    attemptSessionRestoration: function() {
      sessionActions.restore();
    },

    render:function(){
      if (!session.get('lastLogin')) {
        this.attemptSessionRestoration();
        this.redirectToLogin();
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
