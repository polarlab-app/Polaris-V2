const { Schema, model } = require('mongoose');

const configItem = {
    name: String,
    value: String,
};

let guildData = new Schema(
    {
        id: String,
        name: String,
        icon: String,
        description: String,
        data: [configItem],
        config: {
            general: [configItem],
            logs: {
                channelLogs: [configItem],
                serverLogs: [configItem],
                roleLogs: [configItem],
                memberLogs: [configItem],
                messageLogs: [configItem],
            },
            verification: {
                roles: [String],
                channelId: String,
            },
            leveling: [configItem],
            music: [configItem],
        },
    },
    {
        collection: 'guildData',
    }
);

module.exports = model('guildData', guildData);
