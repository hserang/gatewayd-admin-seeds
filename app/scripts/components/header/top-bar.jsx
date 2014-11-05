var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var Branding = require('../../shared/components/branding/branding.jsx');
var NavLinks = require('../../shared/components/nav-links/nav-links.jsx');
var Greeting = require('../../shared/components/greeting/greeting.jsx');

var TopBar = React.createClass({
  getDefaultProps: function() {
    //Sample config. TODO: pass it into props
    var defaults = {
      brandName: "Your Brand Here",
      wrapperClass: "top-bar",
      links: [{
        text: "link1",
        href: "/"
      },
      {
        text: "link2",
        href: "/"
      },
      {
        text: "link3",
        href: "/"
      }]
    };

    return {setup: defaults};
  },

  render: function() {
    return (
      <div className={this.props.setup.wrapperClass}>
        <Navbar>
          <div className="navbar-header">
            <Branding brandName={this.props.setup.brandName} />
          </div>
          <Greeting />
          <br />
          <div>
            <NavLinks links={this.props.setup.links} />
          </div>
        </Navbar>
      </div>
    );
  }
});

module.exports = TopBar;
