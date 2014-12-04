"use strict";

var Chance = require('chance');
var chance = new Chance();

var data = {
  admin: {
    gatewaydUrl: 'http://localhost:5000',
    sessionKey: 'gatewaydapikey',
    lastLogin: Date.now(),
    credentials: chance.string({length: 64})
  }
};

module.exports = data;
