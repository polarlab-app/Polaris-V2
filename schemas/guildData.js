const { Schema, model } = require('mongoose');

let guildData = new Schema(
    {
        id: String,
        name: String,
        icon: String,
        description: String,
        data: {
            type: Map,
            of: String,
        },
        config: {
            general: {
                type: Map,
                of: String,
            },
            logs: {
                channelLogs: {
                    type: Map,
                    of: String,
                },
                serverLogs: {
                    type: Map,
                    of: String,
                },
                roleLogs: {
                    type: Map,
                    of: String,
                },
                memberLogs: {
                    type: Map,
                    of: String,
                },
                messageLogs: {
                    type: Map,
                    of: String,
                },
            },
            verification: {
                status: String,
                channelId: String,
                roles: [String],
            },
            leveling: {
                type: Map,
                of: String,
            },
            music: {
                type: Map,
                of: String,
            },
        },
    },
    {
        collection: 'guildData',
    }
);

module.exports = model('guildData', guildData);
