const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder2');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const caseSchema = require('../../schemas/case');
const generateCaseID = require('../../utilities/generateCaseID');

module.exports = {
    name: 'kick',
    description: 'Kicks a member from the server',
    options: [
        {
            name: 'user',
            description: 'The user to kick',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for kicking the member',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'notes',
            description: 'Any additional notes regarding the kick',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'proof',
            description: 'Proof relating to the kick',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    module: 'moderation',

    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],

    callback: async (polaris, interaction) => {
        try {
            const user = await interaction.options.get('user');
            const reason = (await interaction.options.get('reason')?.value) || 'N/A';
            const notes = (await interaction.options.get('notes')?.value) || 'N/A';
            const proof = (await interaction.options.get('proof')?.value) || 'N/A';

            const member = await interaction.guild.members.fetch(user.value);
            /*await member.kick(reason);*/
            await caseSchema.create({
                id: generateCaseID(),
                name: 'memberLogs',
                serverID: interaction.guild.id,
                status: 'Closed',
                action: 'Member Kicked',
                date: new Date().toISOString(),
                duration: 'Permanent',
                users: {
                    offenderID: member.id,
                    offenderUsername: member.user.username,
                    authorID: interaction.user.id,
                    authorUsername: interaction.user.username,
                },
                details: {
                    note: notes,
                    reason: reason,
                    proof: proof,
                },
            });

            const embed = await embedBuilder({
                title: 'Member Kicked',
                description: `<@${member.id}> has been successfully kicked for *${reason}*\n\n> **User:** ${member.user.username}\n> **Author: <@${interaction.user.id}>**\n> **Reason:** ${reason}`,
                footerType: 'moderation',
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
