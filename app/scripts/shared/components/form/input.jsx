'use strict';

var _ = require('lodash');
var React = require('react');
var Formsy = require('formsy-react');
var Label = require('react-bootstrap').Label;

var Input = React.createClass({
  mixins: [Formsy.Mixin],

  getDefaultProps: function() {
    return {
      inputClass: "form-control"
    };
  },

  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },

  render: function() {
    var className = 'form-group '
    var errorMessage = this.getErrorMessage();
    var label;

    if (this.props.label) {
      label = <label htmlFor={this.props.name}>{this.isRequired() ? <Label bsStyle="info">Required</Label> : null} {this.props.label}</label>;
    } else {
      label = null;
    }

    className += this.showRequired() ? 'required' : this.showError() ? 'error' : '';

    return (
      <div className={className}>
        {label}
        <input
          autofocus={this.props.autofocus}
          className={this.props.inputClass}
          type={this.props.type}
          disabled={this.props.disabled}
          onChange={this.changeValue}
          value={this.getValue()}
          id={this.props.name}
        />
        <span>{errorMessage}</span>
      </div>
    );
  }
});

module.exports = Input;
