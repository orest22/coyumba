const ScheduleService = require('node-schedule');
const Team = require('../entities/Team');
const List = require('../entities/List');
const ListService = require('../services/ListService');
const ScraperService = require('../services/ScrapingService');
require('../../util/extensions');


class TeamService {

    constructor(options) {
        options = options || {};
        this.bot = options.bot || new Error('Not bot set');
        this.storage = options.storage || new Error('No storage set');
        this.currentTeam = null;
        this.listService = new ListService({
            scraper: new ScraperService()
        });
    }

    /**
     * Save team
     * @param {Team} team 
     * @return {Promise} 
     */
    save(team) {
        return new Promise((resolve, reject) => {
            if (team) {
                this.storage.teams.save(team.toJSON(), (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error('Team is not defined'));
            }
        });
    }

    /**
     * Runs callback with fetched team as an arg
     * @param {String} teamId 
     * @param {*} cb 
     */
    getTeamById(teamId) {

        return new Promise((resolve, reject) => {
            this.storage.teams.get(String(teamId), (error, jsonTeam) => {
                if (error) {
                    reject(new Error(`Error: ${teamId} ${error}`));
                }

                if (jsonTeam) {
                    const team = Team.fromJSON(jsonTeam);
                    this.currentTeam = team; // cache current team

                    resolve(team);
                } else {
                    reject(new Error('Error: The team not found'));
                }
            });
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
    addJobTo(team, job) {
        if (!job.id) {
            while (!job.id || team.jobs.ids.indexOf(job.id) > -1) {
                job.id = String(Math.floor(Math.random() * 1000000));
            }
        }

        team.addJob(job);

        // Schedule job
        ScheduleService.scheduleJob(job.id, job.pattern, () => {
            job.callback && job.callback(job.bot, job.channel);
        });

        return job;
    }

    /**
     * Removes job by id from the team
     * @param {String} id 
     */
    removeJobFrom(team, id) {
        team.removeJob(id);
        const scheduled = ScheduleService.scheduledJobs[id];
        if (scheduled) {
            scheduled.cancel();
        }
    }

    /**
     * Removes all jobs
     * @param {*} team 
     */
    removeAllJobs(team) {
        if (team) {
            team.jobs.ids.forEach(id => {
                this.removeJobFrom(team, id);
            });
        }
    }

    /**
     * Lists all jobs
     * @param List all jobs for certain slack Team
     */
    listJobsFor(team) {
        const result = team.jobs.ids.map((jobId) => team.jobs.byId[jobId].print());

        return result;
    }

    /**
     * Run all the jobs for the team
     * @param {Team} team Slack team
     */
    runTheJobsFor(team) {
        team.ids.map((jobId) => team.jobs.byId[jobId].start());
    }

    /**
     * Fetches list for this week
     * @param {Team} team 
     * @returns {Team} updated team
     */
    async fetchListFor(team) {
        
        const date = new Date();
        const listId = `${date.getFullYear()}${date.getMonth()}${date.getWeek()}`;

        let list = team.getListById(listId);

        if (list) {
            return list;
        }

        // We don't have current list in db yet
        // No list lets fetch it from website
        list = await this.listService.fetchList();

        if (list) {
            team.addList(list);
        }

        // Save to storage
        await this.save(team);

        return team.getListById(listId);
    }
}

module.exports = TeamService;