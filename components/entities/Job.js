//const CronJob = require('cron').CronJob;
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
        // try {
        //     this.cronJob = new CronJob(this.pattern, () => {
        //         this.callback && this.callback(this.bot, this.channel);
        //     }, null, false, timezone);

        //     this.cronJob.start();

        // } catch (err) {
        //     console.log('Job not created');
        //     this.debug();
        //     console.log(err);
        // }

    }

    /**
     * Stop it self
     */
    stop() {
        // if(this.cronJob) {
        //     this.cronJob.stop();
        // }
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
        return '[' + this.id + '] job has been added to <#' + this.channel + '>. Job will fire with interval: ' + this.pattern;
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
            action: this.action,
            channel: this.channel
        };
    }

    static fromJSON(options) {
        // Make sure we have right action
        if(options.action) {
            const callback = JobActions[options.action];
            options.callback = callback;
        }

        const job = new Job(options);
        return job;
    }
}

module.exports = Job;