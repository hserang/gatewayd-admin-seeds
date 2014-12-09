"use strict";

var React = require('react');

var Sidebar = React.createClass({
  getDefaultProps: function() {
    return {
      sidebarClassName: 'sidebar'
    };
  },

  render: function() {
    return(
      <div className={this.props.sidebarClassName}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Sidebar;
