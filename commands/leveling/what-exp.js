const embedBuilder = require('../../creators/embeds/embedBuilder2');
const errorHandler = require('../../handlers/errorHandler');
const calculateRankExp = require('../../utilities/calculateRankExp');
const guildData = require('../../schemas/guildData');
const { ApplicationCommandOptionType } = require('discord.js');
const memberData = require('../../schemas/memberData');

module.exports = {
    name: 'what-exp',
    description: 'Displays the amount of experience needed to level up',
    module: 'leveling',
    options: [
        {
            name: 'level',
            description: 'The level to get the experience for',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const level = interaction.options.get('level').value;
            const guild = await guildData.findOne({ id: interaction.guild.id });
            const member = await memberData.findOne({ id: `${interaction.guild.id}${interaction.user.id}` });
            const requiredExp = await calculateRankExp(level);
            const exp = requiredExp - member.stats.exp;

            let messages;
            if (guild.config.leveling.type == 'static') {
                messages = exp / guild.config.leveling.amount;
            } else if (guild.config.leveling.type == 'range') {
                const [min, max] = guild.config.leveling.amount.split('/');
                const middle = (parseInt(min) + parseInt(max)) / 2;
                messages = Math.round(exp / middle);
            }

            const embed = await embedBuilder({
                title: 'Experience Required',
                description: `To reach level **${level}**, you need **${requiredExp}** ✨ exp. That is approximately **${messages}** more messages!\n\n> **Level:** 🏷️ ${level}\n> **Experience Required:** ✨ ${exp}\n> **Messages Required:** ${messages}`,
                footerType: 'leveling',
            });
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await errorHandler({
                interaction: interaction,
                errorType: 'generic',
                commandName: module.exports.name,
                error: error,
            });
        }
    },
};
