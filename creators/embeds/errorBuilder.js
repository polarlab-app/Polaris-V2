const { EmbedBuilder } = require("discord.js");
const { errors } = require("../../data/embedData.json")

function errorEmbedCreator(errorType) {
    const errorEmbed = new EmbedBuilder()
        .setColor("#2B2D31")
        .setTitle(errors[errorType])

    return errorEmbed;
}

module.exports = errorEmbedCreator;