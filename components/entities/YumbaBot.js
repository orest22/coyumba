const SlackBot = require('botkit').slackbot;


class YumbaBot extends SlackBot {
    constructor(options) {
        super(options);

        this.mailService = options.mailClient || null;
    }
}

module.exports = YumbaBot;