'use strict';

var React = require('react');

var Navigation = require('react-router').Navigation;

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Label = require('react-bootstrap').Label;

var Session = require('../models/session');
var SessionActions = require('../actions');

var LoginForm = React.createClass({
  mixins: [Navigation],

  handleSubmit: function(e) {
    e.preventDefault();

    // var name = this.refs.name.getValue().trim();
    var name = 'admin';
    var gatewaydUrl = this.refs.gatewaydUrl.getValue().trim();
    var sessionKey = this.refs.sessionKey.getValue().trim();

    if (!name || !sessionKey || !gatewaydUrl) {
      this.setState({
        showErrorMessage: true
      });

      return false;
    }

    var loginDetails = {
      name: name,
      gatewaydUrl: gatewaydUrl,
      sessionKey: sessionKey
    };

    this.setState({
      showErrorMessage: false
    });

    SessionActions.login(loginDetails);
  },

  handleError: function() {
    this.setState({
      showErrorMessage: true
    });
  },

  getInitialState: function() {
    return {
      showErrorMessage: false
    };
  },

  componentDidMount: function() {
    var _this = this;

    Session.on('sync', function() {
      _this.transitionTo('/payments/outgoing');
    });

    Session.on('error', this.handleError);
  },

  componentWillUnmout: function() {
    Session.off('sync');
    Session.off('error');
  },

  render: function() {
    return (
      <form role="form" className="col-xs-12" onSubmit={this.handleSubmit}>
        <Input type="gatewaydUrl" label="Enter gatewayd host url:"
          ref="gatewaydUrl" autoFocus={true} value={this.state.baseGatewaydUrl}
          onChange={this.handleChange} />
        <Input type="password" label="Enter key:" ref="sessionKey" />
        <Button className="pull-right" type="submit" bsStyle="primary" block>Log In</Button>
        {this.state.showErrorMessage ?
          <Label className="pull-left" bsStyle="warning">
            API key/gatewayd host url is not correct. Please try again.
          </Label> : null}
      </form>
    );
  }
});

module.exports = LoginForm;
