'use strict';

var React = require('react');

var PaymentHistory = React.createClass({
  componentDidMount: function() {
    this.props.model.on('change', function() {
      // ???
    });
  },

  componentWillUnmout: function() {
    this.props.model.off('change');
  },

  render: function() {
    return ();
  }
});

module.exports = PaymentHistory;
