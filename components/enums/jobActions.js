const composeAttachments = require('../../util/helpers').composeAttachments;
const ListService = require('../services/ListService');
const ScrapingService = require('../services/ScrapingService');
const TeamService = require('../services/TeamService');

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
    const emailTo = process.env.ADMIN_MAIL;

    const teamService = new TeamService({
        bot: bot,
        storage: storage,
    });

    teamService.getTeamById(bot.team_info.id, (team) => {
        
    });


    // let ls = new ListService({
    //     storage: storage,
    //     scraper: new ScrapingService()
    // });


    // ls.fetchList().then(list => {
    //     let text = list.toEmail();

    //     if (bot) {

    //         const args = {
    //             channel,
    //             text: `Yumba order has been sent to: ${emailTo}`
    //         };

    //         mailService.sendText(emailTo, 'Yumba Bot - Order', text).then(() => {
    //             // Send menu list
    //             bot.say(args);
    //         }).catch(error => {
    //             bot.say({
    //                 channel,
    //                 text: error.message
    //             });
    //         });

    //     }

    // });
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

    let ls = new ListService({
        storage: storage,
        scraper: new ScrapingService()
    });

    ls.fetchList().then(list => {
        let text = '';
        let actions = [];

        text = list.toSlack();

        // Create actions
        list.items.forEach(item => {
            actions.push({
                'name': item.id,
                'text': item.id,
                'value': `${list.id}|${item.id}`,
                'type': 'button',
            });
        });

        const attachments = composeAttachments(actions);

        if (bot) {

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

    });

};

const test = (options) => {
    options = options || {};
    const {
        bot,
        channel,
        message
    } = options;
    const d = new Date();
    bot.say({
        channel,
        text: `Test job fired at ${d}`
    });
};


module.exports = {
    email,
    poll,
    test
};