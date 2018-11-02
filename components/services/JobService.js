const Job = require('../entities/Job');
/**
 * Manages jobs
 */
class JobService {

    /**
     * Constructor
     * @param {SlackBot} bot Current Bot
     */
    constructor(bot) {
        this.jobs = {
            ids: [],
            byId: {}
        };
        this.bot = bot;
    }

    /**
     * Returns Job by id
     * @param {String} id Id of the job to get
     * @return {Job}
     */
    get(id) {
        return this.jobs[id];
    }

    /**
     * Adds the job and starts it immidietly
     * @param {String|Date} pattern CronJob patter
     * @param {Message} message Slack Message
     * @param {String} id 
     * @param {enums.jobActions|string} one of vailiable actions
     * @param cb
     */
    add(pattern, message, id, cb) {
        if (!id) {
            while (!id || this.jobs.ids.indexOf(id) > -1) {
                id = Math.floor(Math.random() * 1000000);
            }
        }

        const job = new Job(this.bot, id, pattern, message.channel, cb);

        // Save job
        this.jobs.byId[id] = job;
        this.jobs.ids.push(id);

        job.start();

        return job;
    }

    /**
     * Removes job by id
     * @param {String} id 
     */
    remove(id) {
        if (!this.jobs.byId[id]) {
            throw new Error(`Job [${id}] not found`);
        }

        this.jobs.byId[id].stop();

        delete this.jobs.byId[id];
        this.jobs.ids = this.jobs.ids.filter(jobId => jobId !== id);
    }

    /**
     * Lists all jobs
     */
    list() {
        const result = this.jobs.ids.map((jobId) => this.jobs.byId[jobId].print());

        return Promise.all(result);
    }

    /**
     * Debugs all jobs
     */
    debug() {
        console.log('debug jobs');
    }
}

module.exports = JobService;