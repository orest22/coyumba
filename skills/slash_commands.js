const JobService = require('../components/services/JobService');
const TeamService = require('../components/services/TeamService');
const settingsSlashCommand = require('../util/settings');
const cronJobs = require('../util/cron_jobs');


module.exports = function (controller) {

    controller.on('slash_command', function (bot, message) {

        // Current team
        const teamService = new TeamService({
            bot: bot,
            storage: controller.storage,
        });

        if (message.command === '/coyumba' && message.text) {
            try {

                const commandArr = message.text.split(' ');

                switch (commandArr[0]) {
                    case 'jobs':
                        if (commandArr[1]) {
                            cronJobs(commandArr, message, bot, controller, teamService);
                        }
                        break;
                    case 'settings': // [list | set] [property] [value]
                        if (commandArr[1]) {
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