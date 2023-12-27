const messageLogs = require('../../schemas/messageLogger')

module.exports = async (polaris, message) => {
    await messageLogs.create({
        id: message.id,
        content: message.content
    })
}