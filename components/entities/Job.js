const JobActions = require('../enums/jobActions');
const User = require('./User');
const {arrayToJSON, jsonToArray} = require('../../util/helpers');

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
        this.users = options.users || new Error('User wasn\'t set');
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
            channel: this.channel,
            users: arrayToJSON(this.users)
        };
    }

    static fromJSON(options) {
        // Make sure we have right action
        if(options.action) {
            const callback = JobActions[options.action];
            options.callback = callback;
        }

        // Set user
        if(options.users) {
            options.users = jsonToArray(options.users, (user) => User.fromJSON(user));
        }

        const job = new Job(options);
        return job;
    }
}

module.exports = Job;