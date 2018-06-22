const List = require('../entities/List');
const ListItem = require('../entities/ListItem');
const User = require('../entities/User');
const helpers = require('../../util/helpers');

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
     */
    getListById(listId, cb) {

        this.storage.lists.get(String(listId), function(error, dataSnapshot) {
            let items = [];

            if(!dataSnapshot) {
                throw new Error(`List #${listId} not found`);
            }

            console.log('LIST->', listId, dataSnapshot);

            dataSnapshot.items.forEach(item => {
                items.push(new ListItem({
                    id: item.id,
                    title: item.title,
                    users: helpers.jsonToArray(item.users, object => new User(object))
                }));
            });

        

            const list = new List({
                title: dataSnapshot.title,
                items: items,
            });

            // pass list to callback
            cb(list);
        });

    }


    /**
     * Get list
     */
    async getList() {
        try {
            let list;
            let items = [];

            // Try to get list from storage
            list = await this.storage.lists.latest().then(dataSnapshot => {

                let storageList = null;
                
                dataSnapshot.forEach(function(childSnapshot) {
                    childSnapshot.child('items').forEach(item => {
                        console.log("USERS:");
                        console.log(item.child('users').val());
                        
                        
                        items.push(new ListItem({
                            id: item.child('id').val(), 
                            title: item.child('title').val(),
                            users: helpers.jsonToArray(item.child('users').val(), object => new User(object))
                        }));
                    });

                    storageList = new List({
                        title: childSnapshot.child('title').val(),
                        items: items,
                    });

                    return true;
                });

                return storageList;
                
            });

            // If list is empty
            if(!list) {
                console.log('From web site');
               list = await this.scraper.getList().then(data => {
                    
                    items = data.items.map((listItem, index) => new ListItem(index+1, listItem));

                    return new List({
                        items: items,
                        title: data.title
                    });
                }).catch(error => {
                    console.log('Error: Wasn\'t able to fetch list.', error);
                });

                if(list) {
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