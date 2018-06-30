const arrayToJSON = require('../../util/helpers').arrayToJSON;

class List {
    /**
     * 
     * @param {Object} options
     * @param {String} options.title List title
     */
    constructor(options) {
        const date = new Date();
        options = options || {};
        this.title = options.title || 'No name';
        this.id = `${date.getFullYear()}${date.getMonth()}${date.getDay()}`;
        this.total = options.total || 0;    
        this.items = options.items || []; // array of options to select from list
    }

    /**
     * Return string ready for slack message
     */
    toSlack() {
        //@todo return string with choices and users for each choice
        let text = `*${this.title}*\n\n`;

        // Create actions
        this.items.forEach(item => {
            text += item.toSlack();
        });

        text += `\n*Total votes*: ${this.total}`;

        return text;
    }

    addItem(item) {
        this.items.push(item);
    }

    toggleUserForItem(id, user) {
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (element.id === id) {
                console.log(element);
                element.toggleUser(user, toggle => this.updateTotal(toggle));
            } else {
                element.removeUser(user, toogle => this.updateTotal(toogle));
            }
        }
    }

    updateTotal(toggle) {
        console.log('Update total', this.total);
        if(toggle) {
            this.total += 1;
        } else {
            this.total -= 1;
        }
        console.log('Updated total', this.total);
    }

    toJSON() {
        return {
            title: this.title,
            total: this.total,
            items: arrayToJSON(this.items),
            id: this.id
        };
    }

    static fromJSON(json) {
        return new List(json);
    }
}

module.exports = List;