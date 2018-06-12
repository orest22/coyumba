const arrayToJSON = require('../../util/helpers');
/**
 * List item
 */
class ListItem {

    constructor(title) {
        this.title = title;
        this.users = [];
    }

    /**
     * Toggle user
     * @param {String} user 
     * @param {Function} callback 
     */
    toggleUser(user, callback) {
        if(this.users.indexOf(user) > -1) {
            this.removeUser(user, callback);
        }else {
            this.addUser(user, callback);
        }
    }

    /**
     * Add user to item
     * @param {String} user 
     * @param {Function} callback 
     */
    addUser(user, callback) {
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
        if(this.users.indexOf(user) > -1) {
            this.users = this.users.filter( u => u !== user );
            
            // Call callback when user get removed
            callback && callback(false);
        }
    }

    toJSON() {
        return {
            title: this.title,
            users: arrayToJSON(this.users)
        };
    }

}

module.exports = ListItem;