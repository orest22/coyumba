const expect = require('chai').expect;
const helpers = require('../util/helpers');

describe('[COMPOSE ATTACHMENTS]', function() {
    it('Testing composeAttachment', function(){
        const actions = [1, 2, 3, 4, 5, 6, 7, 8];
        const attachments = helpers.composeAttachments(actions);
        expect(attachments.length).to.equal(2);
    });
});

describe('[TOGGLE USER]', function() {
    const str = 'Menu item name';
    const userName = 'Orest';
    const blockquote = '\n&gt;';

    it('User select for the first time', function() {
        const newString = helpers.toggleUser(str, userName);
        const result = `${str}${blockquote} <@${userName}>`;

        expect(newString).to.be.equal(result);
    });

    it('User select for the second time', function() {

        const result = `${str}`;
        const prevString = `${str} ${blockquote} <@${userName}>`;
        const newString = helpers.toggleUser(prevString, userName);

        expect(newString).to.be.equal(result);
    });
    
});

