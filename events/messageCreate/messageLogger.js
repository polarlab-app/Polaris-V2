const messageLoggerSchema = require('../../schemas/messageLogger')

module.exports = async (polaris, message) => {
    await messageLoggerSchema.create({
        id: message.id,
        content: message.content
    })
}