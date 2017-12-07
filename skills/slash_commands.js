var CronJob = require('cron').CronJob;



module.exports = function(controller) {
    controller.on('slash_command',function(bot,message) {
        console.log(message);

        const commandArr = message.split(' ');

        if(commandArr[0] === 'coyumba' && commandArr[1]) {
            try {
                const job = new CronJob({
                    cronTime: '00 01 * * * *',
                    onTick: function() {
                        bot.replyPublic(message,'Everyone can see this part of the slash command');
                    },
                    start: false,
                });
    
                switch (commandArr[1]) {
                    case 'start':
                        job.start();
                        break;
                    case 'stop':
                        job.stop();
                        break;
                    default:
                        break;
                }
            } catch (error) {
                 console.log(error);
            }
            
        }
        
        // reply to slash command
       
        bot.replyPrivate(message,'Only the person who used the slash command can see this.');
        
    });
};