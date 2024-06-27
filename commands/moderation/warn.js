const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

const memberData = require('../../schemas/memberData');

module.exports = {
    name: 'warn',
    description: 'Warns a member',
    options: [
        {
            name: 'user',
            description: 'The user to warn',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for warning the member',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    module: 'moderation',

    permissionsRequired: [PermissionFlagsBits.ChangeNickname],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await interaction.options.get('user');
            const reason = await interaction.options.get('reason').value;

            let key;

            const memberDb = await memberData.findOne({ id: `${interaction.guild.id}${user.value}` });
            key = await Math.random().toString(16).substr(2, 12);

            if (await memberData.findOne({ warns: [{ id: key }] })) {
                key = await Math.random().toString(16).substr(14);
            }

            const newWarn = { id: key, reason: reason, moderatorId: interaction.user.id };
            memberDb.warns.push(newWarn);
            await memberDb.save();

            const tcode = Math.floor(Date.now() / 1000);
            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [user.value, interaction.user.id, reason, tcode, key, user.user.username],
                undefined,
                `https://cdn.discordapp.com/avatars/${user.value}/${user.user.avatar}.png`
            );
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
