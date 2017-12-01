const expect = require('chai').expect;
const helpers = require('../util/helpers');

describe('Helper Functions', function() {
    it('Testing composeAttachment', function(){
        const actions = [1, 2, 3, 4, 5, 6, 7, 8];
        const attachments = helpers.composeAttachments(actions);
        expect(attachments.length).to.equal(2);
    });
});

