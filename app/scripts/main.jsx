"use strict";

var React = require('react');
var routes = require('./components/router.jsx');

// React.renderComponent(<App />, document.getElementById('content-main'));
React.renderComponent(routes, document.getElementById('content-main'));
