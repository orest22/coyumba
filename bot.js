const env = require('node-env-file');
const MailService = require('./components/services/MailService');
const ScheduleService = require('node-schedule');
const YumbaBot = require('./components/entities/YumbaBot');

try {
  env(__dirname + '/.env');
} catch (error) {
  console.log('Error: No Env File. Use global letiables');
}

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  process.exit(1);
}

const debug = require('debug')('botkit:main');

const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  }
};


const firebaseStorage = require('./components/services/FireBaseService')({
  apiKey: process.env.firebase_apikey,
  databaseURL: process.env.firebase_uri,
  authDomain: process.env.firebase_uri,
});

const bot_options = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  debug: true,
  scopes: ['bot'],
  studio_token: process.env.studio_token,
  studio_command_uri: process.env.studio_command_uri,
  storage: firebaseStorage,
  mailClient: new MailService(mailgunOptions),
};

// Create the Botkit controller, which controls all instances of the bot.
let controller = new YumbaBot(bot_options);
controller.startTicking();

// Load all running jobs for all teams
firebaseStorage.teams.all((error, teams) => {
  teams.forEach((team) => {
    if (team.jobs) {
      Object.keys(team.jobs).forEach(function (key) {
        const job = team.jobs[key];
        if (job) {
          // Schedule job
          ScheduleService.scheduleJob(job.id, job.pattern, () => {
            job.callback && job.callback(job.bot, job.channel);
          });
        }
      });
    }
  });
});

// @todo load jobs per team 

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express_webserver.js')(
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