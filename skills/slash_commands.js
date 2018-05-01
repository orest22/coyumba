var CronJob = require('cron').CronJob;
var JobManager = require('../components/cron/job-manager.js');


module.exports = function(controller, bot) {

    var jm = new JobManager(bot);

    
    controller.on('slash_command',function(bot, message) {
        
        let response = 'Empty response',
            job;

        if(message.command === '/coyumba' && message.text) {
            try {

                const commandArr = message.text.split(' ');
                console.log(commandArr);
    
                switch (commandArr[0]) {
                    case 'start':
                        job = jm.add('* * * * * 5', message.channel);
                        response = job.print();
                        break;
                    case 'stop':
                        jm.jobs.forEach(job => {
                            job.stop();
                        });
                        response =  'Stoped';
                        break;
                    case 'list':
                        response =  jm.list().then((
                            arr => {
                                response = arr.join('\n');
                            }
                        )).catch(err => {
                            response = err.message;
                        });
                        break;
                    default:
                        break;
                }
            } catch (error) {
                 console.log(error);
            }
            
        }
        
        // reply to slash command
       
        bot.replyPrivate(message, response);
        
    });
};