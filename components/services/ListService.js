const List = require('../entities/List');
const ListItem = require('../entities/ListItem');
const User = require('../entities/User');
const helpers = require('../../util/helpers');
require('../../util/extensions');
class ListService {

    constructor(options) {
        options = options || {};
        this.storage = options.storage;
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
    async fetchList() {
        try {
            let list;
            let items = [];

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

            return list;

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = ListService;