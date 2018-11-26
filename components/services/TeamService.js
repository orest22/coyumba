const Team = require('../entities/Team');

class TeamService {

    constructor(options) {
        options = options || {};
        this.bot = options.bot || new Error('Not bot set');
        this.storage = options.storage || new Error('No storage set');
        this.currentTeam = null;
    }

    /**
     * Save team
     * @param {Team} team 
     * @param {Function} cb 
     */
    static save(team, cb) {
        if (team) {
            this.storage.teams.save(team.toJSON(), cb);
        }
    }

    /**
     * Runs callback with fetched team as an arg
     * @param {String} teamId 
     * @param {*} cb 
     */
    static getTeamById(teamId, cb) {
        this.storage.teams.get(String(teamId), (error, jsonTeam) => {
            if (error) {
                throw new Error(`Error: ${error}`);
            }

            if(jsonTeam) {
                const team = Team.fromJSON(jsonTeam);
                this.currentTeam = Team.fromJSON(jsonTeam); // cache current team

                cb && cb(team);
            } else {
                console.log('Error: The team not found');
            }

        });
    }

    /**
     * Get job for id
     * @param {Team} team Slack team
     * @param {String} id Job id
     */
    getJobById(team, id) {
        return team.getJobById(id);
    }

    /**
     * Adds the job and starts it immediately
     * @param {Team} Slack team
     * @param {channel} Slack channel where the job will fire. Team should have default channel for the bot
     * @param {Job} Cron Job
     */
    addJobTo(team, channel, job) {
        if (!job.id) {
            while (!job.id || this.jobs.ids.indexOf(job.id) > -1) {
                job.id = Math.floor(Math.random() * 1000000);
            }
        }

        job.channel = channel;

        return job;
    }

    /**
     * Removes job by id from the team
     * @param {String} id 
     */
    removeJobFrom(team, id) {
        team.removeJob(id);
    }

    /**
     * Removes all jobs
     * @param {*} team 
     */
    removeAllJobs(team) {
        team.jobs.forEach(job => {
            team.removeJob(job.id);
        });
    }

    /**
     * Lists all jobs
     * @param List all jobs for certain slack Team
     */
    listJobsFor(team) {
        const result = team.ids.map((jobId) => team.jobs.byId[jobId].print());

        return Promise.all(result);
    }

    /**
     * Run all the jobs for the team
     * @param {Team} team Slack team
     */
    runTheJobsFor(team) {
        team.ids.map((jobId) => team.jobs.byId[jobId].start());
    }

}

module.exports = TeamService;