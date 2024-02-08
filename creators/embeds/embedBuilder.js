const { EmbedBuilder } = require('discord.js');
const { titles, descriptions, footers, fields, timestamps } = require('../../data/embedData.json');
const replaceArray = require('../../utilities/replaceArray');

async function embedBuilder(embedType, module, props, image) {
    const embed = new EmbedBuilder().setColor('#2B2D31');
    if (titles[embedType]) {
        embed.setTitle(await replaceArray(titles[embedType], props));
    }
    if (descriptions[embedType]) {
        embed.setDescription(await replaceArray(descriptions[embedType], props));
    }
    if (fields[embedType]) {
        const embedFields = fields[embedType];
        for (const key in embedFields) {
            const field = embedFields[key];
            embed.addFields({ name: field.title, value: await replaceArray(field.value, props), inline: true });
        }
    }
    if (timestamps[embedType] == 'true') {
        embed.setTimestamp();
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
