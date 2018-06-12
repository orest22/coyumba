let env = require('node-env-file');
try {
  env(__dirname + '/.env');
} catch (error) {
  console.log('Error: No Env File. Use global letiables');
}

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}

let Botkit = require('botkit');
let debug = require('debug')('botkit:main');
let firebaseStorage = require('./components/services/FireBaseService')({
  apiKey: process.env.firebase_apikey,
  databaseURL: process.env.firebase_uri,
  authDomain: process.env.firebase_uri,
});

let bot_options = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  debug: true,
  scopes: ['bot'],
  studio_token: process.env.studio_token,
  studio_command_uri: process.env.studio_command_uri,
  storage: firebaseStorage,
};

// Create the Botkit controller, which controls all instances of the bot.
let controller = Botkit.slackbot(bot_options);
controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
let webserver = require(__dirname + '/components/express_webserver.js')(
  controller
);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

let normalizedPath = require('path').join(__dirname, 'skills');
require('fs')
  .readdirSync(normalizedPath)
  .forEach(function (file) {
    require('./skills/' + file)(controller);
  });