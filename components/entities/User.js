const Entity = require('../entities/_base/Entity');

class User extends Entity {
    constructor(options) {
        super(options);
    }

    toJSON() {
        return {
            id: this.id
        };
    }
}

module.exports = User;