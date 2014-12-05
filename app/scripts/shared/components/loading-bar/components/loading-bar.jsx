"use strict";

var React = require('react');
var ProgressBar = require('react-bootstrap').ProgressBar;
var Model = require('../models/loading-bar');
var loadingBarModel = new Model();

var LoadingBar = React.createClass({
  updateProgress: function() {
    this.setState({
      style: loadingBarModel.get('style'),
      label: loadingBarModel.get('label'),
      currentProgress: loadingBarModel.get('currentProgress')
    });
  },

  getInitialState: function() {
    return {
      style: 'primary',
      label: '',
      currentProgress: 0
    };
  },

  componentDidMount: function() {
    loadingBarModel.on('change', this.updateProgress);
  },

  render: function() {
    return (
      <ProgressBar bsStyle={this.state.style}
        label={this.state.label}
        now={this.state.currentProgress} />
    );
  }
});

module.exports = LoadingBar;
