const JobActions = require('../components/enums/jobActions');

module.exports = function(jobArr, message, bot, controller, jm) {
    let job,
        pattern,
        action;

    if (!jobArr[1]) return;

    switch (jobArr[1]) {
        case 'add':
            action = jobArr[2] || null;

            pattern = jobArr.splice(3).join(' '); // rest should be pattern

            // if pattern and action was set
            if (pattern && action) {
                const actionFunction = JobActions[action] || false;

                if (!actionFunction) return false; // no action, just exit

                job = jm.add(pattern, message, null, () => {
                    console.log('ADD JOB CHANNEL: '+message.channel);
                    actionFunction({
                        bot,
                        channel: message.channel,
                        controller,
                        message,
                    });
                });

                if (job) {
                    job.print().then(jobInfo => {
                        bot.replyPrivate(message, jobInfo);
                    }).catch(err => {
                        bot.replyPrivate(message, err.message);
                    });
                } else {
                    bot.replyPrivate(message, `Job wasn't created for action: [${action}]`);
                }
            }
            break;
        case 'stop':
            jm.jobs.ids.forEach(jobID => {
                jm.remove(jobID);
            });
            bot.replyPrivate(message, 'All jobs have been stoped');
            break;
        case 'list':
            jm.list().then(
                list => {
                    if (list.length) {
                        bot.replyPrivate(message, `List: \n${list.join('\n')}`);
                    } else {
                        bot.replyPrivate(message, 'List is empty');
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
};