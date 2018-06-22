class Entity {

    constructor(options) {
        this.id = options.id;
    }

    toJSON() {
        return {
            id: this.id
        };
    }
}

module.exports = Entity;