"use strict";

var React = require('react');
var TopBar = require('./header/top-bar.jsx');
var Footer = require('./footer/footer.jsx');

var Router = require('react-router');
var Link = Router.Link;

var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var Nav = require('react-bootstrap').Nav;

require('react-bootstrap');

var App =
  React.createClass({

  render:function(){
    return (
      <div className="container">
        <Navbar>
          <div className="navbar-header">
            <a className="navbar-brand">
              We have routing!
            </a>
          </div>
          <Nav>
            <NavItem><Link to="hellos">Fancy</Link></NavItem>
            <NavItem><Link to="hellos2">Slang</Link></NavItem>
            <NavItem><Link to="hellos3">Gorilla</Link></NavItem>
          </Nav>
        </Navbar>
        <this.props.activeRouteHandler />
        <Footer />
      </div>
    )
  }
});

module.exports = App;
