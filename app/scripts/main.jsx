"use strict";

var React = require('react');

// needed for dev tools to work
window.React = React;

var App = require('./components/app.jsx');

React.renderComponent(<App />, document.getElementById('content-main'));
