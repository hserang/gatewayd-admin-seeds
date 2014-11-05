"use strict";

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var NotFound = require('./not-found/not-found.jsx');

var Payments = require('../payments/components/payments.jsx');
var LoginForm = require('../session/components/login-form.jsx');
var Session = require('../session/components/session.jsx');

// needed for dev tools to work
window.React = React;

var App = require('./app.jsx');

var routes = (
  <Routes>
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={Payments} />
      <Route name="login" handler={Session} />
      <Route name="logout" handler={Session} />
      <Route name="payments" handler={Payments}>
        <Route name="incoming" path="incoming" handler={Payments} />
        <Route name="outgoing" path="outgoing" handler={Payments} />
        <Route name="completed" path="completed" handler={Payments} />
        <Route name="failed" path="failed" handler={Payments} />
        <Route name="new" path="new" handler={Payments} />
      </Route>
      <Route name="notFound" handler={NotFound} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);

module.exports = routes;

