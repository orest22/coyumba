const {arrayToJSON, jsonToArray} = require('../../util/helpers');
const User = require('./User');
/**
 * List item
 */
class ListItem {

    constructor(options) {
        this.id = options.id;
        this.title = options.title;
        this.users = options.users || [];
    }

    /**
     * Toggle user
     * @param {String} user 
     * @param {Function} callback 
     */
    toggleUser(user, callback) {
        const userIds = this.users.map(user => user.id);

        if (userIds.indexOf(user.id) > -1) {
            this.removeUser(user, callback);
        } else {
            this.addUser(user, callback);
        }
    }

    /**
     * Add user to item
     * @param {String} user 
     * @param {Function} callback 
     */
    addUser(user, callback) {
        //@TODO add user object it has to have id
        this.users.push(user);

        // Call callback when user get removed
        callback && callback(true);
    }

    /**
     * Remove user
     * @param {String} user 
     * @param {Function} callback 
     */
    removeUser(user, callback) {
        const newUsers = this.users.filter(u => u.id !== user.id);

        if (newUsers.length < this.users.length) {
            this.users = newUsers;
            // Call callback when user get removed
            callback && callback(false);
        }

        return;
    }

    toSlack() {
        let users = this.users.map(user => `<@${user.id}>`);
        let item = `*${this.id}.* ${this.title}.\n`;
        if (users.length) {
            item += `\n&gt;${users.join(', ')}\n`;
        }

        return item;
    }

    toEmail() {
        const usersList = this.users.reduce((list, user) => list+=' '.user.name, '\n');
        return `${this.id} | ${this.title} - ${this.users.length || 0}\n${usersList}`;
    }

    /**
     * Converts to JSON
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            users: arrayToJSON(this.users)
        };
    }

    /**
     * Converts from plain json
     * @param {Object} options 
     */
    static fromJSON(options) {
        return new ListItem({
            ...options,
            users: jsonToArray(options.users, (obj) => User.fromJSON(obj))
        });
    }

}

module.exports = ListItem;