const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const memberData = require('../../schemas/memberData');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'warns',
    description: 'Displays a users warns',
    options: [
        {
            name: 'user',
            description: 'The user whose warns to display',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
    ],
    module: 'moderation',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await interaction.options.get('user');

            const memberDb = await memberData.findOne({ id: `${interaction.guild.id}${user.value}` });
            const warns = memberDb.warns;

            const formattedWarns = await warns
                .map(
                    (warn) =>
                        `> **ID:** ${warn.id}\n> **Reason:** *${warn.reason}*\n> **Moderator:** <@${warn.moderatorId}>\n`
                )
                .join('\n');

            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [user.user.username, formattedWarns],
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
