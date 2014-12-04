"use strict";

var _ = require('lodash');
var Dispatcher = require('flux').Dispatcher;

//abstract dispatch method
//this will allow us to apply data handling if needed
var AdminDispatcher = _.merge(new Dispatcher, {
  handleEvent: function(data) {
    this.dispatch(data);
  }

});

module.exports = AdminDispatcher;
