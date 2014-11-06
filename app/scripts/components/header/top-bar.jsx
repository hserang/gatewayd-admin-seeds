var React = require('react');
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
        <Branding brandName={this.props.setup.brandName} />
        <Greeting />
        <NavLinks
          links={this.props.setup.links}
          className="nav navbar-nav navbar-right"/>
      </div>
    );
  }
});

module.exports = TopBar;
