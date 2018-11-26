const expect = require('chai').expect;
const Team = require('../components/entities/Team');
const Job = require('../components/entities/Job');
const NormalizedStructure = require('../components/entities/NormalizedStructure');

/**
 * Job Manager test suite
 */
describe('[Jobs For Team]', function() {
    const team = new Team({}),
            jobId = '1';

    it('Team created', function() {
        console.log(typeof team.jobs);
        expect(team.jobs).to.be.a('object');
    });

    it(`addJob [${jobId}]`, function() {
        const callback  = () => {};
        const job = new Job({
            pattern: '* * * * * 5',
            id: jobId,
            channel: 'channel',
            callback,
            action: 'test',
        });
        team.addJob(job);
        expect(team.jobs.byId).to.have.property(jobId);
    });

    it(`getJobById [${jobId}]`, function() {
        const job = team.getJobById(jobId);
        expect(job.id).to.equal(jobId);
    });

    // it(`job [${jobId}] is running`, function() {
    //     expect(jm.get(jobId).cronJob.running).to.be.true;
    // });

    it(`removeJob [${jobId}]`, function() {
        team.removeJob(jobId);
        expect(team.jobs.byId).not.to.have.property(jobId);
    });

});