"use strict";

var _ = require('lodash');

var validationMixin = {

  validationErrors: [],

  testValid: function(value, attr, rules) {
    if (_.isNull(value) && !rules[attr].isRequired) {
      return true;
    } else if (_.isUndefined(value)) {
      this.validationErrors.push(attr + ' is undefined');

      return false;
    }

    var isValid = false;
    var minLength = rules[attr].minLength;

    if (typeof value === 'number') {
      isValid = !isNaN(value);
    } else if (typeof value === 'string') {
      isValid = !_.isEmpty(value) && value.length >= minLength;
    } else if (_.isArray(value)) {
      isValid = value.length >= minLength;
    } else if (typeof value === 'object') {
      isValid = !_.isNull(value) && _.keys(value).length >= minLength;
    }

    if (!isValid) {
      this.validationErrors.push(attr + ' is invalid');
    }

    return isValid;
  },

  validate: function(attributes) {
    var _this = this;
    var isValid;

    this.resetValidationErrors();

    isValid = _.reduce(attributes, function(accumulator, value, attr) {
      if (_.isUndefined(_this.validationRules[attr])) {
        return accumulator && true;
      }

      if (_this.testValid(value, attr, _this.validationRules)) {
        return accumulator && true;
      }

      return false;
    }, true);


    if (!Object.keys(attributes).length) {
      isValid = false;
    }

    if (!isValid) {
      return this.validationErrors.join(', ');
    }
  },

  resetValidationErrors: function() {
    this.validationErrors.length = 0;
  }
};

module.exports = validationMixin;
