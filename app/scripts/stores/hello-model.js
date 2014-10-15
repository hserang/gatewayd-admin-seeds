var _ = require('lodash');
var Backbone = require('backbone');
var Dispatcher = require('../dispatchers/dispatcher');

var Greeting = Backbone.Model.extend({
  defaults: {
    greeting: "<click a button>"
  },

  initialize: function() {
    _.bindAll(this, 'updateGreeting', 'dispatchCallback');

    Dispatcher.register(this.dispatchCallback);
  },

  updateGreeting: function(data) {
    this.set('greeting', data.greeting);
  },

  dispatchCallback: function(payload) {
    var handleAction = {
      update: this.updateGreeting
    };

    if (_.isUndefined(handleAction[payload.actionType])) {
      return false;
    }

    handleAction[payload.actionType](payload.data);
  }
});

module.exports = Greeting;
