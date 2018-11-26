class NormalizedStructure {
    constructor() {
        this.byId = {};
        this.ids = [];
    }

    static fromJSON(array, factory) {
        let structure = new NormalizedStructure();
        if(array) {
            array.map(item => {
                const obj = factory(item);
                structure.ids.push(obj.id);
                structure.byId[obj.id] = obj;
            });
        }
        return structure;
    }

    toJson() {

    }
}

module.exports = NormalizedStructure;