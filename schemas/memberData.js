const { Schema, model } = require('mongoose');

let memberData = new Schema(
    {
        id: String,
        exp: Number,
        rank: Number,
    },
    {
        collection: 'memberData'
    }
)

module.exports = model('memberData', memberData);