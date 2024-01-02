const { EmbedBuilder } = require('discord.js');
const { titles, descriptions, footers } = require('../../data/embedData.json');
const replaceArray = require('../../utilities/replaceArray');

async function embedBuilder(embedType, module, props) {
    const description = await descriptions[embedType];

    const embed = new EmbedBuilder().setColor('#2B2D31');
    if (titles[embedType]) {
        embed.setTitle(await replaceArray(titles[embedType], props));
    }
    if (descriptions[embedType]) {
        embed.setDescription(await replaceArray(description, props));
    }
    if (footers[module].text) {
        embed.setFooter({
            text: footers[module].text,
            iconURL: footers[module].iconURL,
        });
    }

    return embed;
}

module.exports = embedBuilder;
