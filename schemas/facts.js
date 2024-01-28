const { Schema, model } = require('mongoose');

const facts = new Schema(
    {
        content: String
    },
    {
        collection: 'facts',
    }
);

module.exports = model('facts', facts);
