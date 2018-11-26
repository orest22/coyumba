class Entity {

    constructor(options) {
        options = options || {};
        this.id = options.id;
    }

    toJSON() {
        return {
            id: this.id
        };
    }
}

module.exports = Entity;