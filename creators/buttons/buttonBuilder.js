const { ids, names, emojis, types, urls } = require('../../data/buttonData.json');
const { ButtonBuilder, ButtonStyle } = require('discord.js');

async function buttonBuilder(name) {
    const button = new ButtonBuilder()
        .setCustomId(ids[name])
        .setEmoji(emojis[name])
        .setStyle(ButtonStyle[types[name]])
        .setLabel(names[name]);

    if (types[name] === 'Link') {
        button.setURL(urls[name]);
    }

    return button;
}

module.exports = buttonBuilder;
