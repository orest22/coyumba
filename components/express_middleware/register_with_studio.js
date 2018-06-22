var request = require('request');
var debug = require('debug')('botkit:register_with_studio');
module.exports = function (webserver, controller) {

    controller.registerDeployWithStudio = function (host) {



        if (webserver && controller.config.studio_token) {
            webserver.use(function (req, res, next) {
                controller.registerDeployWithStudio(req.get('host'));
                next();
            });

        }
    };

};