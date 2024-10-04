const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const generateCaseID = require('../../utilities/generateCaseID');

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
        {
            name: 'notes',
            description: 'Any additional notes regarding the warning',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'proof',
            description: 'Proof relating to the warning',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    module: 'moderation',

    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await interaction.options.get('user');
            const reason = await interaction.options.get('reason').value;

            const memberDB = await memberData.findOne({ id: `${interaction.guild.id}${user.value}` });
            const caseID = generateCaseID();

            memberDB.cases.push(caseID);
            await memberDB.save();

            await caseSchema.create({
                id: caseID,
                name: 'warnLogs',
                serverID: interaction.guild.id,
                status: 'Closed',
                action: 'Member Warned',
                date: new Date().toISOString(),
                duration: 'Permanent',
                users: {
                    offenderID: user.value,
                    offenderUsername: user.user.username,
                    authorID: interaction.user.id,
                    authorUsername: interaction.user.username,
                },
                details: {
                    note: notes,
                    reason: reason,
                    proof: proof,
                },
            });

            const tcode = Math.floor(Date.now() / 1000);
            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [user.value, interaction.user.id, reason, tcode, caseID, user.user.username],
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
