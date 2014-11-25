'use strict';

var React = require('react');

var Navigation = require('react-router').Navigation;

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Label = require('react-bootstrap').Label;

var Session = require('../models/session');
var SessionActions = require('../actions');

var appConfig = require('../../../shared/app-config');

var LoginForm = React.createClass({
  mixins: [Navigation],

  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getValue().trim();
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

  handleNameChange: function(event) {
    this.setState({
      baseName: event.target.value
    });
  },

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

    Session.on('sync', function() {
      _this.transitionTo('/payments/outgoing/all');
    });

    Session.on('error', this.handleError);
  },

  componentWillUnmout: function() {
    Session.off('sync');
    Session.off('error');
  },

  render: function() {
    return (
      <form role="form" className="col-xs-6 col-xs-offset-3" onSubmit={this.handleSubmit}>
        <Input type="text" label="Host url:"
          ref="gatewaydUrl" value={this.state.baseUrl}
          onChange={this.handleGatewayUrlChange} />
        <Input type="text" label="Username:"
          ref="name" value={this.state.baseName} autoFocus={true}
          onChange={this.handleNameChange} />
        <Input type="password" label="Key:" ref="sessionKey" />
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
