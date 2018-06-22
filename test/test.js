let env = require('node-env-file');
const ListService = require('../components/services/ListService');
const FireBaseService  = require('../components/services/FireBaseService');
const ScrapingService = require('../components/services/ScrapingService');
const User  = require('../components/entities/User');

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

ls.getList().then(list => {
    const user = new User({
        id: 'Orest'
    });
    console.log(list);

    list.toggleUserForItem(list.items[0].id, user);
    list.title = 'test';

    console.log('Before save');
    console.log(list.items);

    ls.save(list, function() {
        console.log('After saving');
        console.log(list.items[0].users);
    });
});