var CronJob = require('cron').CronJob;



module.exports = function(controller) {
    controller.on('slash_command',function(bot,message) {
        console.log(message);

        

        if(message.command === '/coyumba' && message.text) {
            try {
                const job = new CronJob({
                    cronTime: '00 01 * * * *',
                    onTick: function() {
                        console.log('Cron task.');
                        bot.replyPublic(message,'Everyone can see this part of the slash command');
                    },
                    start: false,
                });

                const commandArr = message.text.split(' ');
                console.log(commandArr);
    
                switch (commandArr[0]) {
                    case 'start':
                        console.log('start');
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