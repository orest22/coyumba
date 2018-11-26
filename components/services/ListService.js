const List = require('../entities/List');
const ListItem = require('../entities/ListItem');
const User = require('../entities/User');
const helpers = require('../../util/helpers');
require('../../util/extensions');
class ListService {

    constructor(options) {
        options = options || {};
        this.storage = options.storage || console.error('Storage wasn\'t set');
        this.scraper = options.scraper || console.error('Scraper wasn\'t set');
        this.list = null;
    }

    /**
     * Save list to storage
     * @param {Object} List 
     * @param {Function} Callback
     */
    save(list, cb) {
        this.storage.lists.save(list.toJSON(), cb);
    }

    /**
     * Get list by id
     * @param {*} listId 
     * @todo refactor to use firebase byId
     */
    getListById(listId, cb) {

        this.storage.lists.get(String(listId), function (error, dataSnapshot) {
            let items = [];
            let total = 0;

            if (!dataSnapshot) {
                throw new Error(`List #${listId} not found`);
            }

            dataSnapshot.items.forEach(item => {

                const listItem = new ListItem({
                    id: item.id,
                    title: item.title,
                    users: helpers.jsonToArray(item.users, (object) => new User(object))
                });
                total += listItem.users.length;

                items.push(listItem);
            });

            const list = new List({
                title: dataSnapshot.title,
                items: items,
                total: total,
            });

            // pass list to callback
            cb(list);
        });

    }


    /**
     * Get list
     * @returns List
     */
    async getList() {
        try {
            let list;
            let items = [];
            const date = new Date();
            const listId = `${date.getFullYear()}${date.getMonth()}${date.getWeek()}`;

            // Try to get list from storage
            list = await this.storage.lists.byId(listId).then(dataSnapshot => {

                let storageList = null;
                let total = 0;

                if (dataSnapshot.exists()) {
                    dataSnapshot.child('items').forEach(item => {
                        const listItem = new ListItem({
                            id: item.child('id').val(),
                            title: item.child('title').val(),
                            users: helpers.jsonToArray(item.child('users').val(), object => new User(object))
                        });

                        total += listItem.users.length;

                        items.push(listItem);
                    });

                    storageList = new List({
                        title: dataSnapshot.child('title').val(),
                        items: items,
                        total: total,
                    });
                }

                return storageList;

            });

            // If list is empty
            if (!list) {
                console.log('From web site');
                list = await this.scraper.getList().then(data => {

                    items = data.items.map((listItem, index) => new ListItem({
                        id: index + 1,
                        title: listItem
                    }));

                    return new List({
                        items: items,
                        title: data.title
                    });
                }).catch(error => {
                    console.log('Error: Wasn\'t able to fetch list.', error);
                });

                if (list) {
                    console.log(list);
                    this.save(list);
                }
            }

            return list;

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = ListService;