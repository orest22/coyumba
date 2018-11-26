const CronJob = require('cron').CronJob;
const JobActions = require('../enums/jobActions');
var timezone = process.env.TIMEZONE;

/**
 * Cron Job wrapper
 * @todo get rid of any bot stuff, only callback has to be passed
 */
class Job {

    /**
     * 
     * @param {Object} options
     */
    constructor(options) {
        options = options || {};
        this.bot = options.bot;
        this.id = options.id;
        this.channel = options.channel || new Error('Channel wasn\'t set');
        this.callback = options.callback || new Error('Callback wasn\'t set');
        this.pattern = options.pattern || new Error('Pattern wasn\'t set');
        this.action = options.action || 'No name';
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
            console.log('Job not created');
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
            this.bot.api.channels.info({
                channel: this.channel
            }, (err, res) => {
                if (res.ok == false) {
                    reject(res.error);
                }

                if (res.channel) {
                    let channelName = res.channel.name;
                    resolve('[' + this.id + '] job has been added #' + channelName + '. Job will fire with interval: ' + this.pattern);
                } else {
                    reject(new Error('Job has to be created in the channel'));
                }

            });
        });
    }

    /**
     * Helper method for debugging purpose
     */
    debug() {
        console.log('[' + this.id + '] #' + ' Job ' + ' ' + this.pattern);
    }

    toJSON() {
        return {
            id: this.id,
            pattern: this.pattern,
            action: this.action
        };
    }

    static fromJSON(options) {
        // Make sure we have right action
        if(options.action) {
            const callback = JobActions[options.action];
            options.callback = callback;
        }
        
        return new Job(options);
    }
}

module.exports = Job;