
var CronJob = require('cron').CronJob;
var timezone = process.env.TIMEZONE;

/**
 * Cron Job wrapper
 */
class Job {

    constructor(bot, id, pattern, channel, callback) {
        this.bot = bot;
        this.id = id;
        this.channel = channel;
        this.callback = callback;
    }

    start() {
        this.cronJob = new CronJob(this.pattern, () => {
            this.callback && this.callback();
        }, null, false, timezone);

        this.cronJob.start();
    }

    stop() {
        this.cronJob.stop();
    }

    serialize() {
        return {
            pattern: this.pattern,
            channel: this.channel
        };
    }

    print() {

        return new Promise((resolve, reject) => {
            this.bot.api.channels.info({ channel: this.channel }, (res, err) => {
                if(err) {
                    reject(err);
                }
                
                let channelName = res.channel.name;
                resolve( '[' + this.id + '] #' + channelName + ' ' + this.pattern);
            });
        });
    }
}

module.exports = Job;