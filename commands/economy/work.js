const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const userData = require('../../schemas/userData');
const economy = require('../../schemas/economy');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'work',
    description: 'Work a job to get money',
    options: [
        {
            name: 'job',
            description: 'The job to take',
            required: false,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'test',
                    value: 'test',
                },
            ],
        },
    ],
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await userData.findOne({ id: interaction.user.id });

            if (!user.economy.job) {
                await errorHandler({});
                return;
            }

            const jobs = await economy.findOne({ name: 'jobs' });
            const job = jobs.array.find((job) => job.name === user.job);

            const pay = job.properties.find((property) => property.name === 'pay').value;
            const req = job.properties.find((property) => property.name === 'requirement').value;

            /* const embed = await embedBuilder(module.exports.name, module.exports.module,[await polaris.ws.ping])
            await interaction.editReply({embeds: [embed]}) */
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
