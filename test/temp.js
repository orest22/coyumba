let env = require('node-env-file');
const ListService = require('../components/services/ListService');
const FireBaseService = require('../components/services/FireBaseService');
const ScrapingService = require('../components/services/ScrapingService');
const User = require('../components/entities/User');
const TeamService = require('../components/services/TeamService');
const Team = require('../components/entities/Team');

try {
    env('./.env');
} catch (error) {
    console.log('Error: No Env File. Use global letiables');
}

const fireBaseStorage = FireBaseService({
    apiKey: process.env.firebase_apikey,
    databaseURL: process.env.firebase_uri,
    authDomain: process.env.firebase_uri,
});


let ls = new ListService({
    storage: fireBaseStorage,
    scraper: new ScrapingService()
});

const teamService = new TeamService({
    storage: fireBaseStorage
});


teamService.getTeamById('T6BPHLXPB').then(async (team) => {

    const list = await teamService.fetchListFor(team);

    console.log(list);

}).catch(error => {
    console.log(error);
});