"use strict";

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var NotFound = require('./not-found/not-found.jsx');

var Payments = require('../payments/components/Payments.jsx');
var LoginForm = require('../sessions/components/login-form.jsx');

// needed for dev tools to work
window.React = React;

var App = require('./app.jsx');

var routes = {};

routes.loggedIn = (
  <Routes>
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={Payments} />
      <Route name="payments" handler={Payments} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);

routes.loggedOut = (
   <Routes>
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={LoginForm} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);

module.exports = routes;

