const { EmbedBuilder } = require('discord.js');
const { success } = require('../../data/embedData.json');

async function successEmbedBuilder(embedType, props) {
    const successEmbed = new EmbedBuilder()
    .setColor('#2B2D31')
    .setTitle(success[embedType]);

    return successEmbed;
}

module.exports = successEmbedBuilder;
