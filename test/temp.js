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

ls.getList().then(list => {

    const user = new User({
        id: 'Orest',
        name: 'Name'
    });

    list.toggleUserForItem(list.items[0].id, user);
    list.title = 'test';

    teamService.getTeamById('T6BPHLXPB', (team) => {
    
        // remove old with the same id
        team.lists = team.lists.filter(l => l.id != list.id);
        // push new
        team.lists.push(list);


        teamService.save(team, () => {
            console.log('Team has ben updated');
        });
    });

});