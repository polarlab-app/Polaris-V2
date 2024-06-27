const { EmbedBuilder } = require('discord.js');
const { colors, titles, descriptions, footers, fields, timestamps } = require('../../data/embedData.json');
const replaceArray = require('../../utilities/replaceArray');

async function embedBuilder(embedType, module, props, image, thumbnail) {
    try {
        const embed = new EmbedBuilder();

        if (colors[embedType]) {
            embed.setColor(colors[embedType]);
        } else {
            embed.setColor('#2B2D31');
        }

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
                embed.addFields({
                    name: field.title,
                    value: await replaceArray(field.value, props),
                    inline: typeof field.inline !== 'undefined' ? field.inline : true,
                });
            }
        }

        if (image) {
            embed.setImage(image);
        }

        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }

        if (timestamps[embedType] == 'true') {
            embed.setTimestamp();
        }

        if (footers[module]) {
            embed.setFooter({
                text: footers[module].text,
                iconURL: footers[module].iconURL,
            });
        }

        return embed;
    } catch (error) {
        console.log(error);
    }
}

module.exports = embedBuilder;
