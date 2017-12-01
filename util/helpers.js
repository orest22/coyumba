// Returns an array of attachments
function composeAttachments(actions) {
    // Spit actions in to attachments.
    // Max 4 actions per attachment
    let attachmetsAmount = Math.ceil(actions.length / 4);
    const attachments = [];

    for(let i = 1; i <= attachmetsAmount; i++) {
        const title = i === 1 ? 'Make your choice from list above.' : '';
        const start = (i - 1) * 4;
        const end = start + 4;

        attachments.push({
            title: title,
            callback_id: 'selectMenuItem',
            attachment_type: 'default',
            actions: actions.slice(start, end),
        });
    }

    return attachments;
}

function toggleUser(item, user) {
    let str = '';
    const blockquote = '&gt;&gt;&gt;';

    // Look if anyone already have chosen item
    if ( item.indexOf(blockquote) > -1){
        
        // Look if current user did select it previously
        if ( item.indexOf(`<@${user}>`) > -1) {
            
            // remove currect user
            str = item.replace(`<@${user}>`, '');

            // Check if other user did select it
            if(str.indexOf('<@') > -1) {
                return str;
            } else {
                return str.replace(blockquote, '').trim();
            }

        } else {
            str = `${item}, <@${user}>`;
        }

    } else {
        str = `${item} ${blockquote} <@${user}>`;
    }

    return str;
}

module.exports = {
    toggleUser: toggleUser,
    composeAttachments: composeAttachments,
};