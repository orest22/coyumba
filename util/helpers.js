// Returns an array of attachments
function composeAttachments(actions) {
    // Spit actions in to attachments.
    // Max 4 actions per attachment
    let attachmetsAmount = Math.ceil(actions.length / 4);
    const attachments = [];

    console.log(attachmetsAmount);

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


module.exports = {
    composeAttachments: composeAttachments,
};