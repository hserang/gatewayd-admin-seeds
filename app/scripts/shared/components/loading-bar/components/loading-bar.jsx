var React = require('react');
var ProgressBar = require('react-bootstrap').ProgressBar;
var Model = require('../models/loading-bar');
var model = new Model();

var LoadingBar = React.createClass({
  updateProgress: function() {
    this.setState({
      style: model.get('style'),
      label: model.get('label'),
      currentProgress: model.get('currentProgress')
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
    model.on('change', this.updateProgress);
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
