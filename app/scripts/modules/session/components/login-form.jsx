"use strict";

var React = require('react');

var Navigation = require('react-router').Navigation;

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Label = require('react-bootstrap').Label;

var session = require('../models/session');
var sessionActions = require('../actions');

var appConfig = require('../../../shared/app-config');

var LoginForm = React.createClass({
  mixins: [Navigation],

  handleSubmit: function(e) {
    e.preventDefault();

    var loginDetails = {
      name: this.refs.name.getValue().trim(),
      gatewaydUrl: this.refs.gatewaydUrl.getValue().trim(),
      sessionKey: this.refs.sessionKey.getValue().trim()
    };

    this.setState({
      showErrorMessage: false
    });

    sessionActions.login(loginDetails);
  },

  handleError: function() {
    this.setState({
      showErrorMessage: true
    });
  },

  // required when input field value is pre-populated
  handleNameChange: function(event) {
    this.setState({
      baseName: event.target.value
    });
  },

  // required when input field value is pre-populated
  handleGatewayUrlChange: function(event) {
    this.setState({
      baseUrl: event.target.value
    });
  },

  getInitialState: function() {
    return {
      baseUrl: appConfig.baseUrl,
      baseName: appConfig.baseName,
      showErrorMessage: false
    };
  },

  componentDidMount: function() {
    var _this = this;

    session.on('sync', function() {
      _this.transitionTo('/payments/outgoing/all');
    });

    session.on('error', this.handleError);
  },

  componentWillUnmout: function() {
    session.off('sync error');
  },

  render: function() {
    return (
      <form role="form" className="col-xs-6 col-xs-offset-3" onSubmit={this.handleSubmit}>
        <Input type="text" label="Host url:"
          ref="gatewaydUrl" value={this.state.baseUrl}
          onChange={this.handleGatewayUrlChange}
          autoFocus={true}
        />
        <Input type="text" label="Username:"
          ref="name" value={this.state.baseName}
          onChange={this.handleNameChange}
        />
        <Input type="password" label="Key:" ref="sessionKey" />
        <Button className="pull-right" type="submit" bsStyle="primary" block>
          Log In
        </Button>
        {
          this.state.showErrorMessage ?
            <Label className="pull-left" bsStyle="warning">
              API key/gatewayd host url is not correct. Please try again.
            </Label> : false
        }
      </form>
    );
  }
});

module.exports = LoginForm;
