const JobActions = require('../components/enums/jobActions');
const Job = require('../components/entities/Job');
const User = require('../components/entities/User');
const TeamService = require('../components/services/TeamService');

module.exports = function (jobArr, message, bot, controller, teamService) {
    let pattern,
        action;

    if (!jobArr[1]) return;

    // Ge the team
    try {
        teamService.getTeamById(bot.team_info.id).then((team) => {
            bot.botkit.debug("TEAM", team);
            // We should have team here
            let jobsList = [];

            switch (jobArr[1]) {
                case 'add':
                    action = jobArr[2] || null;

                    pattern = jobArr.splice(3).join(' '); // rest should be pattern

                    // if pattern and action was set
                    if (pattern && action) {
                        const actionFunction = JobActions[action] || false;

                        if (!actionFunction) return false; // no action, just exit

                        const job = new Job({
                            bot: bot,
                            channel: message.channel,
                            action: action,
                            pattern: pattern,
                            user: User.fromJson(message.user),
                            callback: () => {
                                actionFunction({
                                    bot,
                                    channel: message.channel,
                                    controller,
                                    message,
                                });
                            }
                        });

                        // Add job to the team
                        teamService.addJobTo(team, job);

                        // Save the new team with recently added job
                        teamService.save(team).then(() => {
                            bot.replyPrivate(message, job.print());
                        }).catch((err) => {
                            bot.replyPrivate(message, err.message);
                        });
                    }
                    break;
                case 'stop':
                    teamService.removeAllJobs(team);
                    // Save team
                    teamService.save(team).then(() => {
                        bot.replyPrivate(message, 'All jobs have been stopped');
                    }).catch((err) => {
                        bot.replyPrivate(message, err.message);
                    });

                    break;
                case 'list':
                    jobsList = teamService.listJobsFor(team);
                    bot.botkit.debug('JOB LIST', jobsList);

                    if (jobsList.length) {
                        bot.replyPrivate(message, `List: \n${jobsList.join('\n')}`);
                    } else {
                        bot.replyPrivate(message, `List is empty for Team: ${team.name}`);
                    }

                    break;
                default:
                    break;
            }

        });
    } catch (error) {
        bot.replyPrivate(message, error.message);
    }
};