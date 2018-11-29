const composeAttachments = require('../../util/helpers').composeAttachments;
const ListService = require('../services/ListService');
const ScrapingService = require('../services/ScrapingService');
const TeamService = require('../services/TeamService');
const debug = require('debug')('botkit:main');


/**
 * Email action
 * @param {Object} options 
 */
const email = (options) => {
    options = options || {};

    const {
        bot,
        channel,
        message
    } = options;
    const {
        storage,
        mailService
    } = bot.botkit;
    const emailTo = process.env.ADMIN_MAIL; //@TODO has to be moved to setting

    const teamService = new TeamService({
        bot: bot,
        storage: storage,
    });

    debug('TeamService created');
    debug(`TeamService id ${bot.team_info.id}`);

    teamService.getTeamById(bot.team_info.id, (team) => {
        debug('TEAM');
        debug(team);
        const list = teamService.fetchListFor(team);
        let text = list.toEmail();

        if (bot) {
            const args = {
                channel,
                text: `Yumba order has been sent to: ${emailTo}`
            };

            mailService.sendText(emailTo, 'Yumba Bot - Order', text).then(() => {
                // Send menu list
                bot.say(args);
            }).catch(error => {
                bot.say({
                    channel,
                    text: error.message
                });
            });
        }
    });
};

/**
 * Poll action
 * @param {Object} options 
 */
const poll = (options) => {
    options = options || {};

    const {
        bot,
        channel,
        message
    } = options;
    const isDirect = options.isDirect || false;
    const {
        storage
    } = bot.botkit;

    const teamService = new TeamService({
        bot: bot,
        storage: storage,
    });

    bot.botkit.debug('Team service created',bot.team_info.id);
    

    teamService.getTeamById(bot.team_info.id).then((team) => {
        bot.botkit.debug('TEAM', team);

        const list = teamService.fetchListFor(team);
        let text = '';
        let actions = [];

        if (list && bot) {
            bot.botkit.debug('List', list);

            text = list.toSlack();

            list.items.forEach(item => {
                actions.push({
                    'name': item.id,
                    'text': item.id,
                    'value': `${list.id}|${item.id}`,
                    'type': 'button',
                });
            });

            const attachments = composeAttachments(actions);
            const args = {
                text: text,
                attachment_type: 'default',
                mrkdwn: true,
                attachments: attachments,
                channel: channel,
            };

            // Send menu list
            if (message && isDirect) {
                bot.reply(message, args);
            } else {
                bot.say(args);
            }

        }

    }).catch(error => {
        bot.botkit.debug('Team fetching error', error);

        bot.reply(message, error.message);
    });
};

const test = (options) => {
    options = options || {};
    debug('MESSAGE', options.message);
    const {
        bot,
        channel,
        message
    } = options;
    const d = new Date();
    bot.reply( message, {
        text: `Test job fired at ${d}`
    });
};


module.exports = {
    email,
    poll,
    test
};