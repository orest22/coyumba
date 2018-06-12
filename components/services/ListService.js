class ListService {
    
    constructor(options) {
        options = options || {};
        this.storage = options.storage;
    }

    /**
     * Save list to storage
     * @param {Object} List 
     */
    save(list) {
       this.storage.list.save(list.toJSON()); 
    }
}

module.exports = ListService;