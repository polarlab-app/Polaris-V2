const { Schema, model } = require('mongoose');

let messageLogger = new Schema(
    {
        id: Number,
        userID: String,
        date: String,
        guildID: String,
        channelID: String,
        content: String,
    },
    {
        collection: 'messageLogs',
    }
);

module.exports = model('messageLogs', messageLogger);
