const { Schema, model } = require('mongoose');

let memberData = new Schema(
    {
        id: String,
        exp: Number,
        rank: Number,
        warns: [
            {
                id: String,
                reason: String,
                moderatorId: String,
            },
        ],
    },
    {
        collection: 'memberData',
    }
);

module.exports = model('memberData', memberData);
