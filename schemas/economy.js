const { Schema, model, Types } = require('mongoose');

let economy = new Schema(
    {
        name: String,
        array: [
            {
                name: String,
                properties: [
                    {
                        name: String,
                        value: Number
                    }
                ]
            }
        ]
    },
    {
        collection: 'economy'
    }
);

module.exports = model('economy', economy);