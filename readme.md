# Slack Bot based on [Botkit](https://botkit.ai)
Helps to order the food for the slack team from https://yumba.ca/
---

## Getting started

* Update `.env` file with proper settings
* `yarn`
* `yarn start`


## Commands

* `/coyumba` - Main entry point
    * `+jobs`
        * `+list` - Displays the list of running cron jobs
        * `+add [email|pol] <cron pattern>` - Start new job with job type Email or Poll and using cron pattern Ex: `/coyumba jobs add email 10 * * * * *` - Creats a cron task that send email every 10 seconds
        * `+stop` - Stops all runing jobs

    * `+settings` - Manage some seettings
        * `+list` - Display list of availiable settings
        * `+set key value` - Set setting    

## Skills

* Direct message `List` - fetches list of awailiable options

* Driect message `Menu` - displays image of menu for this week

## TODO

* Slash command to configure bot
* Add skill to display previous choice for user
* Implement ML
* Looks like yumba has an open api https://yumba.ca/api/dishes