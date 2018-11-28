const composeAttachments = require('../util/helpers').composeAttachments;
const ListService = require('../components/services/ListService');
const ScrapingService = require('../components/services/ScrapingService');
const User = require('../components/entities/User');
const pollAction = require('../components/enums/jobActions').poll;
module.exports = function(controller) {

    let ls = new ListService({
        storage: controller.storage,
        scraper: new ScrapingService()
    });

    // define a before hook
    // you may define multiple before hooks. they will run in the order they are defined.
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiobefore
    controller.studio.before('^List', function(convo, next) {

        // do some preparation before the conversation starts...
        // for example, set variables to be used in the message templates
        // convo.setVar('foo','bar');
        
        console.log('BEFORE: menu list');
        
        // don't forget to call next, or your conversation will never continue.
        next();

    });

    controller.hears(['List'], 'direct_message,direct_mention', function(bot, message) {

        bot.reply(message, {
            text: 'Fetching menu list...'
        });

        try {

            pollAction({
                message,
                bot,
                channel: message.channel,
                isDirect: true
            });
            
        } catch (error) {
            console.log(error);
        }
        
    });

    /* Validators */
    // Fire a function whenever a variable is set because of user input
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiovalidate
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    // Validate user input: question_1
    controller.studio.validate('List','question_1', function(convo, next) {

        // const value = convo.extractResponse('question_1');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: Menu VARIABLE: question_1');

        // always call next!
        next();

    });

    // Validate user input: question_2
    controller.studio.validate('List','question_2', function(convo, next) {

        // var value = convo.extractResponse('question_2');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: Menu VARIABLE: question_2');

        // always call next!
        next();

    });

    // Validate user input: question_3
    controller.studio.validate('List','question_3', function(convo, next) {

        // var value = convo.extractResponse('question_3');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: Menu VARIABLE: question_3');

        // always call next!
        next();

    });

    /* Thread Hooks */
    // Hook functions in-between threads with beforeThread
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiobeforethread
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    // Before the default thread starts, run this:
    controller.studio.beforeThread('List','default', function(convo, next) {

        /// do something fun and useful
        // convo.setVar('name','value');

        console.log('In the script *Menu*, about to start the thread *default*');

        // always call next!
        next();
    });

    // Before the on_timeout thread starts, run this:
    controller.studio.beforeThread('List','on_timeout', function(convo, next) {

        /// do something fun and useful
        // convo.setVar('name','value');

        console.log('In the script *Menu*, about to start the thread *on_timeout*');

        // always call next!
        next();
    });


    // define an after hook
    // you may define multiple after hooks. they will run in the order they are defined.
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudioafter
    controller.studio.after('List', function(convo, next) {

        console.log('AFTER: Menu');

        // handle the outcome of the convo
        if (convo.successful()) {

           // var responses = convo.extractResponses();
            // do something with the responses

        }

        // don't forget to call next, or your conversation will never properly complete.
        next();
    });

    // receive an interactive message, and reply with a message that will replace the original
    controller.on('interactive_message_callback', function(bot, message) {        
        // check message.actions and message.callback_id to see what action to take...
        if(message.callback_id === 'selectMenuItem') {
            const valueArr = message.actions[0].value.split('|');
            const itemId = parseInt(valueArr[1], 10);
            const listId = valueArr[0];
            const user = new User(message.raw_message.user);
            let newActions = [];

            try {

                ls.getListById(listId, (list) => {
    
                    list.toggleUserForItem(itemId, user);

                    // Create actions
                    list.items.forEach( item => {
                        newActions.push({
                            'name': item.id,
                            'text': item.id,
                            'value': `${list.id}|${item.id}`,
                            'type': 'button',
                        });
                    });
    
                    ls.save(list, function() {
                        bot.replyInteractive(message, {
                            text: list.toSlack(),
                            mrkdwn: true,                
                            attachments: composeAttachments(newActions),
                        });
                    });
    
                });
                
            } catch (error) {
                console.log(error);
            }
        }
    });
};