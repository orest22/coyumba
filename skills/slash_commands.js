const JobService = require('../components/services/JobService');
const settingsSlashCommand = require('../util/settings');
const cronJobs = require('../util/cron_jobs');


module.exports = function(controller) {
    let jm;

    controller.spawn({
        'token': process.env.bot_token
    }, function (bot) {
        jm = new JobService(bot);
    });
    
    controller.on('slash_command',function(bot, message) {

        if(message.command === '/coyumba' && message.text) {
            try {

                const commandArr = message.text.split(' ');
    
                switch (commandArr[0]) {
                    case 'jobs':
                        if(commandArr[1]) {
                            cronJobs(commandArr, message, bot, controller, jm);
                        }
                        break;
                    case 'settings': // [list | set] [property] [value]
                            if(commandArr[1]) {
                                settingsSlashCommand(commandArr, message, bot, controller);
                            }
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.log(error);
            }
            
        }
               
    });
};