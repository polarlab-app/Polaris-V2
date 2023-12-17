const errorEmbedCreator = require('../creators/embeds/errors/error');
const consoleLogHandler = require('./consoleLogHandler');
const { colors } = require('../data/consoleColors');

module.exports = async ({ interaction, errorType, commandName, error }) => {
    await consoleLogHandler({
        interaction: interaction,
        errorType: errorType,
        commandName: commandName,
    });

    if (error) {
        console.log(colors.error + error);

        await consoleLogHandler({
            interaction: interaction,
            errorType: 'debugInfo',
            commandName: commandName,
        });
    }

    if (interaction) {
        const errorEmbed = await errorEmbedCreator(errorType);
        await interaction.editReply({ embeds: [errorEmbed] });
    }
};
