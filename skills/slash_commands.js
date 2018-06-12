var JobService = require('../components/services/JobService');


module.exports = function(controller) {
    let jm;

    controller.spawn({
        'token': process.env.bot_token
    }, function(bot) {
        jm = new JobService(bot);
    });

    
    controller.on('slash_command',function(bot, message) {
        
        
        let response = 'Empty response ' + message.channel,
            job;

        if(message.command === '/coyumba' && message.text) {
            try {

                const commandArr = message.text.split(' ');
                console.log(commandArr);
    
                switch (commandArr[0]) {
                    case 'add':
                        job = jm.add('* * * * * *', message.channel);
                        job.print().then(jobInfo => { 
                            bot.replyPrivate(message, jobInfo);
                        }).catch(err => {
                            bot.replyPrivate(err.message);
                        });
                        break;
                    case 'stop':
                        console.log('STOP');
                        jm.jobs.ids.forEach(jobID => {
                            jm.remove(jobID);
                        });
                        bot.replyPrivate(message, 'All jobs have been stoped');
                        break;
                    case 'list':
                        jm.list().then(
                            list => {
                                if(list.length) {
                                    bot.replyPrivate(message, `List: \n${list.join('\n')}`);
                                } else {
                                    bot.replyPrivate(message, 'List is empty');
                                }
                            }
                        ).catch(err => {
                            console.log(err);
                            bot.replyPrivate(message, err.message);
                        });
                        break;
                    case 'channel':
                        new Promise((resolve, reject) => {
                            bot.api.channels.info({
                                'channel': message.channel
                            }, function (err, res) {
                                if(res.ok) {
                                    resolve(res.channel.name);
                                } else {
                                    resolve(res.err);
                                }
    
                            });
                        }).then((resolved) => {
                            console.log('Resolved');
                            bot.replyPrivate(message, `Channel info: ${resolved}`);
                        }).catch(err => {
                            console.log(err);  
                        }); 
                        
                        break;    
                    default:
                        break;
                }
            } catch (error) {
                 console.log(error);
            }
            
        }
               
    });
};