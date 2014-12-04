"use strict";

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Navigation = require('react-router').Navigation;
var DocumentTitle = require('react-document-title');

var session = require('../modules/session/models/session');
var sessionActions = require('../modules/session/actions');
var TopBar = require('../shared/components/header/top-bar.jsx');

require('react-bootstrap');

var topBarConfig = {
  brandName: 'Gatewayd Basic',
  wrapperClass: 'navbar-inverse navbar-fixed-top top-bar container-fluid',
  links: []
};

var App =
  React.createClass({
    mixins: [Navigation],

    redirectToLogin: function() {
      if (!session.isLoggedIn()) {
        this.transitionTo('/login');
      }
    },

    render:function(){
      if (!session.get('lastLogin')) {
        sessionActions.restore();
        this.redirectToLogin();
      }

      return (
        <div>
          <TopBar setup={topBarConfig} />
          <div className="container">
            <div className="row">
              <div className="col-sm-12  col-md-12 main">
              <DocumentTitle title='Gatewayd Basic Admin'>
                <RouteHandler />
              </DocumentTitle>
              </div>
            </div>
          </div>
        </div>
      )
    }
});

module.exports = App;
