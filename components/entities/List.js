class List {
    constructor(options) {
        options = options || {};
        this.total = 0;    
        this.items = []; // array of options to select from list
    }

    toSlack() {
        //@todo return string with choices and users for each choice
    }

    addItem(item) {
        this.items.push(item);
    }

    toggleUserForItem(item, user) {
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if(element.title === item.title) {
                element.toggleUser(user, toggle => this.updateTotal(toggle));
            }
        }
    }

    updateTotal(toggle) {
        if(toggle) {
            this.total += 1;
        } else {
            this.total -=1;
        }
    }

    toJSON() {
        return {
            items: this.items
        };
    }
}

module.exports = List;