class NormalizedStructure {
    constructor() {
        this.byId = {};
        this.ids = [];
    }

    static fromJSON(obj, factory) {
        let structure = new NormalizedStructure();
        if (obj) {
            Object.keys(obj).forEach((key) => {
                structure.byId[key] = factory(obj[key]);
            });
            structure.ids = Object.keys(obj);
        }
        return structure;
    }

    toJSON() {
        const json = {};

        this.ids.forEach((id) => {
            json[id] = this.byId[id].toJSON();
        });

        return json;
    }
}

module.exports = NormalizedStructure;