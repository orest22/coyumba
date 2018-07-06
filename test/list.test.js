const expect = require('chai').expect;
const List = require('../components/entities/List');
const ListItem = require('../components/entities/ListItem');
const User = require('../components/entities/User');

describe('LIST', function() {
    let listItem;
    let list;
    const user = new User({
        id: 'User',
        name: 'Orest'
    });
    
    it('List created', function(){
        list = new List({});
        expect(list).to.have.property('items');
    });

    it('Item created', function() {
        listItem = new ListItem('Some title');
        expect(listItem).to.have.all.keys('title', 'users', 'id');
    });

    it('Add item to list', function() {
        list.addItem(listItem);

        expect(list.items).to.include(listItem);
    });

    it('Add user for item', function() {
        list.toggleUserForItem(listItem.id, user);
       
        expect(listItem.users).to.deep.include(user);
    });

    it('List has total', function() {
        expect(list.total).to.equal(1);
    });

    it('Remove user for item', function() {
        list.toggleUserForItem(listItem.id, user);
        
        expect(listItem.users).to.not.include(user);
    });

    it('List total 0', function() {
        expect(list.total).to.equal(0);
    });

});