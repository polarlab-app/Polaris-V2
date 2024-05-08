const { Schema, model } = require('mongoose');

let guildData = new Schema(
    {
        id: String,
        name: String,
        icon: String,
        description: String,
        data: {
            String: String,
        },
        config: {
            general: [configItem],
            logs: {
                channelLogs: {
                    String: String,
                },
                serverLogs: {
                    String: String,
                },
                roleLogs: {
                    String: String,
                },
                memberLogs: {
                    String: String,
                },
                messageLogs: {
                    String: String,
                },
            },
            verification: {
                roles: [String],
                channelId: String,
            },
            leveling: {
                String: String,
            },
            music: {
                String: String,
            },
        },
    },
    {
        collection: 'guildData',
    }
);

module.exports = model('guildData', guildData);
