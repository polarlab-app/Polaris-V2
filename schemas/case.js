const { Schema, model } = require('mongoose');

let caseSchema = new Schema(
    {
        id: String,
        name: String,
        serverID: String,
        status: String,
        action: String,
        date: String,
        duration: String,
        users: {
            offenderID: String,
            offenderUsername: String,
            authorID: String,
            authorUsername: String,
        },
        details: {
            note: String,
            reason: String,
            proof: String,
        },
    },
    {
        collection: 'cases',
    }
);

module.exports = model('case', caseSchema);
