const memberData = require('../../schemas/memberData');

module.exports = async (polaris, message) => {
    if (message.author.bot || !message.content.startsWith('!')) {
        return;
    }
};
