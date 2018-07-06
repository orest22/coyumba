const Entity = require('../entities/_base/Entity');

class User extends Entity {
    constructor(options) {
        super(options);
        this.name = options.name;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        };
    }

    toEmail() {
        return `- ${this.name}\n`;
    }
}

module.exports = User;