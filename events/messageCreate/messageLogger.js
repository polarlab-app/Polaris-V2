const messageLogs = require('../../schemas/messageLogger');

module.exports = async (polaris, message) => {
    if (message.author.bot) {
        return;
    }
    await messageLogs.create({
        id: message.id,
        userID: message.author.id,
        date: new Date().toISOString,
        guildID: message.guild.id,
        channelID: message.channel.id,
        content: message.content,
    });
};
