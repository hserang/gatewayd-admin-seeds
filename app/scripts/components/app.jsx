"use strict";

var React = require('react');
var RouterHeader = require('./header/router-header.jsx');
var Footer = require('./footer/footer.jsx');

var session = require('../session/models/session');

require('react-bootstrap');

var App =
  React.createClass({

  render:function(){
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
