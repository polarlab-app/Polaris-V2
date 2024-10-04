const { EmbedBuilder } = require('discord.js');
const { footers } = require('../../data/embedData.json');
module.exports = async function embedBuilder({
    title,
    description,
    color,
    fields,
    author,
    image,
    thumbnail,
    footerType,
    timestamp,
}) {
    try {
        let embed = new EmbedBuilder();

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (color) embed.setColor(color);
        else embed.setColor('#2B2D31');

        if (fields) {
            for (const field of fields) {
                embed.addField(field.name, field.value, field.inline);
            }
        }
        if (author)
            embed.setAuthor(
                author.name ? author.name : null,
                author.icon ? author.icon : null,
                author.url ? author.url : null
            );
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (footerType) embed.setFooter({ text: footers[footerType].text, iconURL: footers[footerType].iconURL });
        if (timestamp) embed.setTimestamp();

        return embed;
    } catch (error) {
        console.log(error);
    }
};
