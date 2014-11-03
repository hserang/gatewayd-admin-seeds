"use strict";

var React = require('react');

var Navigation = require('react-router').Navigation;
var session = require('../session/models/session');

var RouterHeader = require('./header/router-header.jsx');
var Footer = require('./footer/footer.jsx');

require('react-bootstrap');

var restoreSession = function() {
  var oldSession = sessionStorage.length === 0 ? null : sessionStorage.getItem('session');

  if (oldSession) {
    session.set(JSON.parse(oldSession));
  }

  if (session.isLoggedIn()) {
    this.transitionTo('payments');
  } else {
    this.transitionTo('/');
  }
};

var App =
  React.createClass({
    mixins: [Navigation],

    render:function(){
      // restoreSession.call(this);

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
