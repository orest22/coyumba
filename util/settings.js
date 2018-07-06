const settingsSlashCommand = function(strArr, message, bot, controller) {
    if(strArr[1])
    switch (strArr[1]) {
        case 'list': 
            controller.storage.settings.all((error, list) => {
                if(list.length) {
                    const listStr = list.map(item => `${item}`).join('\n');
                    bot.replyPrivate(message, listStr);
                } else {
                    bot.replyPrivate(message, 'Empty settings');
                }
            });
        break;
        case 'set':
            if(strArr[2] && strArr[3]) {
                const property = strArr[2];
                const value = strArr[3];

                controller.storage.settings.set(property, value, () => bot.replyPrivate(message, 'Saved'));
            }
            break;
        default:
            break;
    }

    return;
};

module.exports = settingsSlashCommand;