const { PresenceUpdateStatus, ActivityType  } = require('discord.js');
const { client } = require('../Client');
function Status (){    
    client.user.setPresence({
        activities: [
            {
                name: ' Lo-Fi Radio Jow',
                type: ActivityType.Listening,
                status: PresenceUpdateStatus.Online,

            }
        ]
    });
}
module.exports = { Status }