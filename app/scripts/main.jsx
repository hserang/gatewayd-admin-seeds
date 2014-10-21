"use strict";

var React = require('react');

var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Hellos = require('./components/hellos/hello.jsx');
var HellosHellos = require('./components/hellos/hello2.jsx');;
var HellosHellosHellos = require('./components/hellos/hello3.jsx');
var NotFound = require('./components/not-found/not-found.jsx');

var Model = require('./stores/hello-model');

var model = new Model();
var modelModel = new Model();
var modelModelModel = new Model();

// needed for dev tools to work
window.React = React;

var App = require('./components/app.jsx');

var routes = (
  <Routes>
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={Hellos} model={model} />
      <Route name="hellos" handler={Hellos} model={model} />
      <Route name="hellos2" handler={HellosHellos} model={modelModel} />
      <Route name="hellos3" handler={HellosHellosHellos} model={modelModelModel} />
      <Route name="notFound" handler={NotFound} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);

// React.renderComponent(<App />, document.getElementById('content-main'));
React.renderComponent(routes, document.getElementById('content-main'));
