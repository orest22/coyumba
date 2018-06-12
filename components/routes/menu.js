var express = require('express');
var debug = require('debug')('botkit:incoming_webhooks');


module.exports = function(webserver, controller) {

    debug('Serve menu images');
    webserver.get('/menu', (req, res) => {
        //@todo add some fancy stuff here later?
    });
};