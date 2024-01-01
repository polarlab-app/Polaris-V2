const { Schema, model } = require('mongoose');

let messageLogger = new Schema(
    {
        id: Number,
        content: String,
    },
    {
        collection: 'messageLogs',
    }
);

module.exports = model('messageLogs', messageLogger);
