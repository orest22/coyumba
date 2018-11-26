class NormalizedStructure {
    constructor() {
        this.byId = {};
        this.ids = [];
    }

    static fromJson(array, factory) {
        let structure = new NormalizedStructure();
        array.map(item => {
            const obj = factory(obj);
            structure.ids.push(item.id);
            structure.byId[obj.id] = obj;
        });

        return structure;
    }
}

module.exports = NormalizedStructure;