const { Schema, model } = require('mongoose');

let memberData = new Schema(
    {
        id: String,
        exp: String,
        rank: String,
        cases: [],
    },
    {
        collection: 'memberData',
    }
);

module.exports = model('memberData', memberData);
