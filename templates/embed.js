const { EmbedBuilder } = require("discord.js");

function nameEmbedCreatorCreator() {
    const nameEmbed = new EmbedBuilder()
    .setColor("#2B2D31")
    .setTitle("Embed Name")
    .setDescription(EmbedDescription)
    .setFooter({
        text: "Module!",
        iconURL: "EmbedIconURL"
    })

    return nameEmbed;
}

module.exports = nameEmbedCreator;