'use strict';

var React = require('react');

var Navigation = require('react-router').Navigation;

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

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
      return false;
    }

    var loginDetails = {
      name: name,
      gatewaydUrl: gatewaydUrl,
      sessionKey: sessionKey
    };

    SessionActions.login(loginDetails);
  },

  componentDidMount: function() {
    var _this = this;
    Session.on('loggedIn', function() {
      _this.transitionTo('/payments/outgoing');
    });
  },

  componentWillUnmout: function() {
    Session.off('loggedIn');
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
