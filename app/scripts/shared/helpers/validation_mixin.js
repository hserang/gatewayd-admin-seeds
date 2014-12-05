"use strict";

var _ = require('lodash');

var validationMixin = {

  //todo map error messages to object or external module
  //for localization
  validators: {
    isString: function(val) {
      return _.isString(val) || ('is not a string');
    },

    isNumber: function(val) {
      return _.isNumber(val) || ('is not a number');
    },

    isBoolean: function(val) {
      return _.isBoolean(val) || ('is not a boolean');
    },

    isArray: function(val) {
      return _.isArray(val) || ('is not a boolean');
    },

    minLength: function(val, length) {
      var length = parseInt(length, 10);

      return (val.length >= length) || ('length should be greater than ' + (length - 1));
    },

    isObject: function(val) {
      return _.isObject(val) || ('is not an object');
    },

    isRequired: function(val) {
      return !(_.isEmpty(val)) || ('is required');
    }
  },

  addValidator: function(newValidator) {
    if (_.isUndefined(newValidator)) {
      return false;
    }

    _.extend(this.validators, newValidator);
  },

  isValidator: function(key) {
    return _.isFunction(this.validators[key]);
  },

  testValid: function(val, attr, rule) {
    var errors = [],
        _this = this;

    _.each(rule.validators, function(test) {
      var args = [],
          valMethod = "";

      //handle string or object
      if (_.isString(test)) {
        args = test.split(':');

        valMethod = args.shift();
      } else if (_.isObject(test)) {
        args = test.args;

        valMethod = test.name;
      }

      //add val to args
      args.unshift(val);

      //ensure validation method exists
      if (_this.isValidator(valMethod)) {
        var result = _this.validators[valMethod].apply(_this, args);

        //only push when false or string
        if (!result || _.isString(result)) {
          errors.push(result);
        }
      } else {
        console.warn("validation method does not exist: " + (test.name || test));
        return null;
      }
    });

    //pass errors to validate
    if (errors.length) {
      return errors;
    }
  },

  validate: function(data) {
    var _this = this,
        errors = [];


    _.each(data, function(val, key) {
      var error = {},
          message;

      //check if it needs to be validated
      if (_this.validationRules[key]) {
        message = _this.testValid(val, key, _this.validationRules[key]);
      }

      if (message) {
        error[key] = message;
        errors.push(error);
      }

    });

    if (errors.length) {
      return errors;
    } else {
      return false;
    }

  }

};

module.exports = validationMixin;
