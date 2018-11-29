let env = require('node-env-file');
const FireBaseService = require('../components/services/FireBaseService');
const User = require('../components/entities/User');
const TeamService = require('../components/services/TeamService');

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


const teamService = new TeamService({
    storage: fireBaseStorage
});


teamService.getTeamById('T6BPHLXPB').then(async (team) => {

    const list = await teamService.fetchListFor(team);

    // const user = new User({
    //     id: 'Orest',	
    //     name: 'Name'	
    // });

    // list.toggleUserForItem(list.items[0].id, user);
    // list.title = 'test';

    console.log(list.toSlack());

    teamService.save(team).then(() => {
        console.log('TEAM WITH NEW LISTS');
    })

}).catch(error => {
    console.log(error);
});