const { EmbedBuilder } = require('discord.js');
const { titles, descriptions, footers } = require('../../data/embedData.json');
const replaceArray = require('../../utilities/replaceArray');


async function embedBuilder(embedType, module, props) {
    const description = await descriptions[embedType];

    const embed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setTitle(titles[embedType])
        .setDescription(await replaceArray(description, props))
        .setFooter({
            text: footers[module].text,
            iconURL: footers[module].iconURL,
        });

    return embed;
}



module.exports = embedBuilder;
