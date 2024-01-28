const { Schema, model } = require('mongoose');

let userData = new Schema(
   {
       id: Number,
       bank_balance: Number,
       purse_balance: Number,
       inventory: [{
           item: String,
           amount: Number
       }],
       job: String,
   },
   {
       collection: 'userData',
   }
);

module.exports = model('userData', userData);