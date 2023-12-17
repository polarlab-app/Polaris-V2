const { ButtonBuilder, ButtonStyle } = require('discord.js');
const { emojis } = require('../../config.json');

function ButtonCreator(polaris, interaction) {
    const Button = new ButtonBuilder()
        .setCustomId('')
        .setEmoji(emojis.check)
        .setLabel('')
        .setStyle(ButtonStyle.Success);

    return Button;
}

module.exports = ButtonCreator;
