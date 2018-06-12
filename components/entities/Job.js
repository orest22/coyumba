
var CronJob = require('cron').CronJob;
var timezone = process.env.TIMEZONE;

/**
 * Cron Job wrapper
 */
class Job {

    /**
     * 
     * @param {Object} bot Slack bot
     * @param {String} id Job id
     * @param {String|Date} pattern CronJob string 
     * @param {String} channel Slack Channel id
     * @param {Function} callback 
     */
    constructor(bot, id, pattern, channel, callback) {
        this.bot = bot;
        this.id = id;
        this.channel = channel;
        this.callback = callback;
        this.pattern = pattern;
    }

    /**
     * Start CronJob
     */
    start() {
        // Try to create the job
        try {
            this.cronJob = new CronJob(this.pattern, () => {
                this.callback && this.callback(this.bot, this.channel);
            }, null, false, timezone);
    
            this.cronJob.start();
        } catch (err) {
            this.debug();
            console.log(err);
        }
        
    }

    /**
     * Stop it self
     */
    stop() {
        this.cronJob.stop();
    }

    /**
     * Returns simple object
     * @returns {Object}
     */
    serialize() {
        return {
            pattern: this.pattern,
            channel: this.channel
        };
    }

    /**
     * Print job to channel
     */
    print() {

        return new Promise((resolve, reject) => {
            console.log('print job');
            this.bot.api.channels.info({ channel: this.channel }, (err, res) => {
                if(res.ok == false) {
                    reject(res.error);
                } 
    
                let channelName = res.channel.name;
                resolve( '[' + this.id + '] #' + channelName + ' ' + this.pattern);
            });
        });
    }

    /**
     * Helper method for debuging purpose
     */
    debug() {
        console.log('[' + this.id + '] #' + ' Job ' + ' ' + this.pattern);
    }
}

module.exports = Job;