const { EmbedBuilder } = require('discord.js');
const { titles, descriptions, footers } = require('../../data/embedData.json');

async function embedBuilder(embedType, module, props) {
    const description = descriptions[embedType];

    const embed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setTitle(titles[embedType])
        .setDescription(await replace(description, props))
        .setFooter({
            text: footers[module].text,
            iconURL: footers[module].iconURL,
        });

    return embed;
}

function replace(description, props) {
    return description.replace(/{(\d+)}/g, function (match, number) {
        return typeof props[number] != 'undefined' ? props[number] : match;
    });
}

module.exports = embedBuilder;
