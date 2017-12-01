const menuScrapper = require('../components/menuScrapper');

module.exports = function(controller) {

    // Returns an array of attachments
    function composeAttachments(actions) {
        // Spit actions in to attachments.
        // Max 4 actions per attachment
        let attachmetsAmount = Math.ceil(actions.length / 4);
        const attachments = [];

        for(let i = 1; i <= attachmetsAmount; attachmetsAmount++) {
            const title = i === 1 ? 'Make your choice from list above.' : '';
            const start = (i - 1) * 4;
            const end = start + 4;

            attachments.push({
                title: title,
                callback_id: 'selectMenuItem',
                attachment_type: 'default',
                actions: actions.slice(start, end),
            });
        }

        return attachments;
    }

    // define a before hook
    // you may define multiple before hooks. they will run in the order they are defined.
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiobefore
    controller.studio.before('List', function(convo, next) {

        // do some preparation before the conversation starts...
        // for example, set variables to be used in the message templates
        // convo.setVar('foo','bar');
        
        console.log('BEFORE: menu list');
        bot.reply(message, {
            text: 'Fetching menu list...'
        });
        
        // don't forget to call next, or your conversation will never continue.
        next();

    });

    controller.hears(['List'], 'direct_message,direct_mention', function(bot, message) {

        bot.reply(message, {
            text: 'Fetching menu list...'
        });

        try {
            // get menu array
            menuScrapper.getMenuList().then( respose => {
                let text = "";
                let actions = [];

                // Create actions
                respose.forEach((menuItem, index) => {
                    const number = index + 1;
                    text += `*${number}.* ${menuItem}. \n`;
                    actions.push({
                        "name": number,
                        "text": number,
                        "value": number,
                        "type": "button",
                    });
                });

                const attachments = composeAttachments(actions);


                // Send menu list
                bot.reply(message, {
                    text: text,
                    attachment_type: 'default',
                    mrkdwn: true,
                    attachments: attachments,
                });
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

        var value = convo.extractResponse('question_1');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: Menu VARIABLE: question_1');

        // always call next!
        next();

    });

    // Validate user input: question_2
    controller.studio.validate('List','question_2', function(convo, next) {

        var value = convo.extractResponse('question_2');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: Menu VARIABLE: question_2');

        // always call next!
        next();

    });

    // Validate user input: question_3
    controller.studio.validate('List','question_3', function(convo, next) {

        var value = convo.extractResponse('question_3');

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

            var responses = convo.extractResponses();
            // do something with the responses

        }

        // don't forget to call next, or your conversation will never properly complete.
        next();
    });

    // receive an interactive message, and reply with a message that will replace the original
    controller.on('interactive_message_callback', function(bot, message) {
        
        // check message.actions and message.callback_id to see what action to take...
        if(message.callback_id === 'selectMenuItem') {
            const value = parseInt(message.actions[0].value, 10);
            const oldMessage = message.original_message.text;
            const user = message.user;
            let newMessage = [];
            let newActions = [];
            console.log(value);
            console.log(oldMessage);
            //const newMessageArr = oldMessage.split('\n');
            oldMessage.split('\n').forEach((item, index) => {
                const selectedRow = value - 1;
                const number = index + 1;
                const action = {
                    "name": number,
                    "text": index === selectedRow ? `✓ ${number}` : number,
                    "style": index === selectedRow ? 'primary' : 'default',
                    "value": number,
                    "type": "button",
                }
                
                //Add action for each menu
                newActions.push(action);

                // append user name to selected row.
                if (index === selectedRow) {
                    console.log(item);
                    console.log(item.indexOf('&gt;&gt;&gt;'));
                    item.indexOf('&gt;&gt;&gt;') > -1 ? newMessage.push(`${item}, <@${user}>`) : newMessage.push(`${item} &gt;&gt;&gt; <@${user}>`)
                } else {
                    newMessage.push(item);
                }
            });

            bot.replyInteractive(message, {
                text: newMessage.join('\n'),
                mrkdwn: true,                
                attachments:[
                    {
                        title: 'Make your choice from list above.',
                        callback_id: 'selectMenuItem',
                        attachment_type: 'default',
                        actions: newActions,
                    }
                ]
            });
        }
    });
}