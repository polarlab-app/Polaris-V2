const { Schema, model } = require('mongoose');

let userData = new Schema(
    {
        id: Number,
        bankBalance: Number,
        purseBalance: Number,
        inventory: [
            {
                item: String,
                amount: Number,
            },
        ],
        job: String,
    },
    {
        collection: 'userData',
    }
);

module.exports = model('userData', userData);
