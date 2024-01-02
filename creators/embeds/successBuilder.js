const { EmbedBuilder } = require('discord.js');
const { success } = require('../../data/embedData.json');
const replaceArray = require('../../utilities/replaceArray');

async function successEmbedBuilder(embedType, props) {
    if (props) {
        const embedText = success[embedType];
        const successEmbed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setTitle(await replaceArray(embedText, props))
        return successEmbed
    } else {
        const successEmbed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setTitle(success[embedType]);
        return successEmbed
    }
}

module.exports = successEmbedBuilder;
