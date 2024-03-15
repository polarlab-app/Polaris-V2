const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { PermissionFlagsBits } = require('discord.js');

const guildData = require('../../schemas/guildData');

module.exports = {
    name: 'verify',
    module: 'moderation',

    permissionsRequired: [],
    botPermissions: [PermissionFlagsBits.ManageRoles],

    callback: async (polaris, interaction) => {
        try {
            const guild = await guildData.findOne({ id: interaction.guild.id });
            const verificationRoles = guild.config.verification.roles;
            console.log(verificationRoles);
            for (const roleId of verificationRoles) {
                let role = await interaction.guild.roles.cache.find((r) => r.id == roleId);
                await interaction.member.roles.add(role).catch(console.error);
            }
            const embed = await embedBuilder(module.exports.name, module.exports.module, [await polaris.ws.ping]);
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
