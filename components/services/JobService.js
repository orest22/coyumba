/**
 * Manages jobs
 */
class JobService {

    /**
     * Constructor
     * @param {SlackBot} bot Current Bot
     */
    constructor() {
        this.jobs = {
            ids: [],
            byId: {}
        };
    }

    /**
     * Returns Job by id
     * @param {String} id Id of the job to get
     * @return {Job}
     */
    get(id) {
        return this.jobs.byId[id];
    }

    /**
     * Adds the job and starts it immediately
     * @param {channel} Slack channel where the job will fire. Team should have default channel for the bot
     * @param {Job} Cron Job
     */
    add(channel, job) {
        if (!job.id) {
            while (!job.id || this.jobs.ids.indexOf(job.id) > -1) {
                job.id = Math.floor(Math.random() * 1000000);
            }
        }

        job.channel = channel;

        // Save job
        this.jobs.byId[job.id] = job;
        this.jobs.ids.push(job.id);

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