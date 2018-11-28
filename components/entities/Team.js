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
        this.settings = options.settings || new NormalizedStructure();
        this.name = options.name;
        this.url = options.url;
        this.createdBy = options.createdBy;
        this.bot = options.bot;
    }

    /**
     * Convert to plain object
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            createdBy: this.createdBy,
            bot: this.bot,
            lists: this.lists.toJSON(),
            jobs: this.jobs.toJSON(),
            settings: this.settings,
        };
    }

    /**
     * Factory that creates it self based on options provided
     * @param {Object} json 
     * @returns {Team}
     */
    static fromJSON(json) {
        const options = {
            id: json.id,
            name: json.name,
            url: json.url,
            createdBy: json.createdBy,
            bot: json.bot,
            lists: NormalizedStructure.fromJSON(json.lists, (object) => List.fromJSON(object)),
            jobs: NormalizedStructure.fromJSON(json.jobs, (object) => Job.fromJSON(object)),
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
    }

    /**
     * Removes job from the team
     * @param {String} id Job uniq id
     * @throws {Error} 
     */
    removeJob(id) {
        const job = this.jobs.byId[id];

        if (!job) {
            throw new Error(`Job [${id}] not found`);
        }

        delete this.jobs.byId[id];
        this.jobs.ids = this.jobs.ids.filter(jobId => jobId !== id);
    }


    /**
     * Get list by list id
     * @param {String} id 
     */
    getListById(id) {
        return this.lists.byId[id];
    }

    /**
     * Add list to the team
     * @param {List} list 
     */
    addList(list) {
        this.lists.byId[list.id] = list;
        this.lists.ids.push(list.id);
    }

    /**
     * Removes list by id
     * @param {String} id 
     */
    removeList(id) {
        const list = this.list.byId[id];

        if (!list) {
            throw new Error(`List [${id}] not found`);
        }

        delete this.list.byId[id];
        this.list.ids = this.list.ids.filter(listId => listId !== id);
    }
}

module.exports = Team;