const messageLogs = require('../../schemas/messageLogger');

module.exports = async (polaris, message) => {
    if (message.author.bot) {
        return;
    }
    await messageLogs.create({
        id: message.id,
        userId: message.author.id,
        content: message.content,
    });
};
