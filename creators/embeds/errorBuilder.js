const { EmbedBuilder } = require("discord.js");
const { embeds } = require("../../data/errorMessages.json")

function errorEmbedCreator(errorType) {
    const embedContent = embeds[errorType];
    const errorEmbed = new EmbedBuilder()
        .setColor("#2B2D31")
        .setTitle(embedContent)

    return errorEmbed;
}

module.exports = errorEmbedCreator;