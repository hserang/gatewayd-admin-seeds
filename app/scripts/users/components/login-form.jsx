'use strict';

var React = require('react');
var Dispatcher = require('../../shared/dispatcher');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var LoginForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getValue().trim();
    var password = this.refs.password.getValue().trim();

    if (!name || !password) {
      return false;
    }

    Dispatcher.dispatch({
      actionType: 'login',
      data: {
        name: name,
        password: password
      }
    });
  },

  componentDidMount: function() {
    this.props.model.on('change', function() {
      // redirect to new view
    });
  },

  componentWillUnmout: function() {
    this.props.model.off('change');
  },

  render: function() {
    return (
      <form role="form" className="col-xs-12" onSubmit={this.handleSubmit}>
        <Input type="text" label="Username" ref="name" />
        <Input type="password" label="Password" ref="password" />
        <Button type="submit" bsStyle="primary">Log In</Button>
      </form>
    );
  }
});

module.exports = LoginForm;
