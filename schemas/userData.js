const { Schema, model } = require('mongoose');

let userData = new Schema(
    {
        id: Number,
        bank_balance: Number,
        purse_balance: Number,
    },
    {
        collection: 'userData',
    }
);

module.exports = model('userData', userData);
