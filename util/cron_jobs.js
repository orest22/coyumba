const JobActions = require('../components/enums/jobActions');
const Job = require('../components/entities/Job');
const TeamService = require('../components/services/TeamService');

module.exports = function (jobArr, message, bot, controller, teamService) {
    let pattern,
        action;

    if (!jobArr[1]) return;

    // Ge the team
    try {
        teamService.getTeamById(bot.team_info.id, (team) => {
            // We should have team here

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
                        teamService.save(team, () => {
                            // Reply with job info
                            job.print().then(jobInfo => {
                                bot.replyPrivate(message, jobInfo);
                            }).catch(err => {
                                bot.replyPrivate(message, err.message);
                            });
                        });
                    }
                    break;
                case 'stop':
                    teamService.removeAllJobs();
                    bot.replyPrivate(message, 'All jobs have been stoped');
                    break;
                case 'list':
                    teamService.listJobsFor(team).then(
                        list => {
                            if (list.length) {
                                bot.replyPrivate(message, `List: \n${list.join('\n')}`);
                            } else {
                                bot.replyPrivate(message, `List is empty for Team: ${team.name}`);
                            }
                        }
                    ).catch(err => {
                        console.log(err);
                        bot.replyPrivate(message, err.message);
                    });
                    break;
                default:
                    break;
            }

        });
    } catch (error) {
        bot.replyPrivate(message, error.message);
    }
};