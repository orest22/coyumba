const Entity = require('../entities/_base/Entity');
const List = require('./List');
const Job = require('./Job');
const NormalizedStructure = require('./NormalizedStructure');
const helpers = require('../../util/helpers');

class Team extends Entity {

    constructor(options) {
        super(options);

        this.lists = options.lists || [];
        this.jobs = options.jobs || new NormalizedStructure();
        this.settings = options.settings || {};
        this.name = options.name;
        this.url = options.url;
        this.createdBy = options.createdBy;
        this.bot = options.bot;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            createdBy: this.createdBy,
            bot: this.bot,
            lists: helpers.arrayToJSON(this.lists),
            jobs: helpers.denormalizeArray(this.jobs),
            settings: this.settings,
        };
    }

    static fromJSON(json) {
        const options = {
            id: json.id,
            name: json.name,
            url: json.url,
            createdBy: json.createdBy,
            bot: json.bot,
            lists: helpers.jsonToArray(json.lists, (object) => List.fromJSON(object)),
            jobs: NormalizedStructure.fromJson(json.jobs, (options) => new Job(options)),
            settings: json.settings,
        };

        return new Team(options);
    }

    /**
     * Returns hob for id
     * @param {String} id 
     * @returns {Job}
     */
    getJobById(id) {
        return this.jobs.byId[id];
    }

    /**
     * Adds job to he list of jobs and start it
     * @param {Job} job 
     */
    addJob(job) {
        // Save job
        this.jobs.byId[job.id] = job;
        this.jobs.ids.push(job.id);
        job.start();
    }

    removeJob(id) {
        if (!this.jobs.byId[id]) {
            throw new Error(`Job [${id}] not found`);
        }

        this.jobs.byId[id].stop();

        delete this.jobs.byId[id];
        this.jobs.ids = this.jobs.ids.filter(jobId => jobId !== id);
    }
}

module.exports = Team;