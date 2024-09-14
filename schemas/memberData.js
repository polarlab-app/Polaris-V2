const { Schema, model } = require('mongoose');

let memberData = new Schema(
    {
        id: String,
        stats: {
            exp: Number,
            rank: Number,
            messages: Number,
        },
    },
    {
        collection: 'memberData',
    }
);

module.exports = model('memberData', memberData);
