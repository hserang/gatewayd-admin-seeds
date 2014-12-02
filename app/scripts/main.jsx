"use strict";

var React = require('react');
var Router = require('react-router');
var routes = require('./components/router.jsx');

// React.renderComponent(<App />, document.getElementById('content-main'));
//React.renderComponent(routes, document.getElementById('content-main'));
Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('content-main'));
});

