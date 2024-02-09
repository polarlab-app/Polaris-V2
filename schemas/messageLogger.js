const { Schema, model } = require('mongoose');

let messageLogger = new Schema(
    {
        id: Number,
        userId: String,
        content: String,
    },
    {
        collection: 'messageLogs',
    }
);

module.exports = model('messageLogs', messageLogger);
