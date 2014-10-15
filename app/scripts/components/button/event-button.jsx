var React = require('react');
var BootstrapButton = require('react-bootstrap').Button;
var Dispatcher = require('../../dispatchers/dispatcher');

var EventButton = React.createClass({
  handleClick: function() {
    console.log('clicked!');
  },

  render: function() {
    return <BootstrapButton onClick={this.handleClick}>{this.props.value}</BootstrapButton>;
  }
});

module.exports = EventButton;
