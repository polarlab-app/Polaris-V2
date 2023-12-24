const { Schema, model} = require('mongoose')

let messageLogger = new Schema({
    id: Number,
    content: String
})

module.exports = model('messageLoggerSchema', messageLogger)