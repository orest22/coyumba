var Job = require('./job.js');
var map = require('lodash.map');

class JobManager {
    constructor(bot) {
        this.jobs = {};
        this.bot = bot;
    }

    get(id) {
        return this.jobs[id];
    }

    add(pattern, channel) {
        var id;
        while (!id || this.jobs[id]) {
            id = Math.floor(Math.random() * 1000000);
        }

        var job = new Job(this.bot, id, pattern, channel, () => {
            return `Job id ${id}`;
        });

        job.start(this.bot);
        this.jobs[id] = job;

        return job;
    }

    remove(id) {
        if (!this.jobs[id]) {
            throw new Error('Job not found');
        }
        this.jobs[id].stop();

        delete this.jobs[id];

    }

    list(resolve, reject) {
        let result = map(this.jobs, (job) => job.print());

        return Promise.all(result).then((list) => {
            resolve(list);
        }).catch((err) => {
            reject(err);
        });
        
    }
}

module.exports = JobManager;