"use strict";

var React = require('react');
var Wallets = require('../../modules/wallets/components/wallets.jsx');

var Sidebar = React.createClass({
  render: function() {
    return(
      <div className="sidebar">
        <Wallets />
      </div>
    );
  }
});

module.exports = Sidebar;
