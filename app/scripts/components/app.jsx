"use strict";

var React = require('react');
var Navigation = require('react-router').Navigation;

var session = require('../modules/session/models/session');
var sessionActions = require('../modules/session/actions');
var RouterHeader = require('./header/top-bar.jsx');
var Greeting = require('../shared/components/greeting/greeting.jsx');

require('react-bootstrap');

var topBarConfig = {
  brandName: 'Gatewayd Basic',
  wrapperClass: 'navbar-inverse navbar-fixed-top top-bar container-fluid',
  links: [ ]
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
            <div className="row">
              <div className="col-sm-12  col-md-12 main">
                {this.props.activeRouteHandler()}
              </div>
            </div>
          </div>
        </div>
      )
    }
});

module.exports = App;
