"use strict";

var React = require('react');

var Address = React.createClass({
  getDefaultProps: function() {
    return {
      direction: "",
      address: ""
    };
  },

  getInitialState: function() {
    return {
      showFull: false,
      showClass: ""
    };
  },

  toggleFullString: function(shouldShow) {
    var reverso = {
      false: " show-full",
      true: ""
    };

    this.setState({"showFull": (this.state.showFull ? false : true)});

    return reverso[shouldShow];
  },

  handleClick: function() {
    this.setState({
      "showClass": this.toggleFullString(this.state.showFull)
    });
  },

  render: function() {
    return(
      <p className={"address" + this.state.showClass}>
        <span className="header" onClick={this.handleClick}>{this.props.direction} Address: </span>
        <span className="data" title={this.props.address}>{this.props.address}</span>
      </p>
    );
  }
});

module.exports = Address;
