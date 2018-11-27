const expect = require('chai').expect;
const schedule = require('node-schedule');

const Job = require('../components/entities/Job');
const Team = require('../components/entities/Team');
const TeamService = require('../components/services/TeamService');

// @TODO add tests
// 1. List the jobs for certain team -> empty list
// 2. Add job -> success
// 3. Add second job -> success
// 4. Remove all jobs -> team jobs list and schedule.scheduledJobs list have to be empty
describe('[TeamService]', () => {
    it('listJobsFor', () => {});
    it('addJobTo', () => {});
    it('addJobTo', () => {});
    it('removeAllJobs', () => {});
});