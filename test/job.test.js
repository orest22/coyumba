const expect = require('chai').expect;
const JobManager = require('../components/cron/job-manager.js');

/**
 * Job Manager test suite
 */
describe('Job Manager', function() {
    const bot = {},
        jm = new JobManager(bot),
        jobId = '1';

    it('job manager created', function() {
        expect(jm).to.have.property('jobs').that.is.a('object');
    });

    it(`add Job [${jobId}]`, function() {
        jm.add('* * * * * 5', 'channel', jobId);
        expect(jm.jobs).to.have.property(jobId);
    });

    it(`job [${jobId}] is running`, function() {
        expect(jm.get(jobId).cronJob.running).to.be.true;
    });

    it(`remove Job [${jobId}]`, function() {
        jm.remove(jobId);
        expect(jm.jobs).not.to.have.property(jobId);
    });

});