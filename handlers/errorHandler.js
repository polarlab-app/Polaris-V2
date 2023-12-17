const errorEmbedCreator = require('../creators/embeds/errors/error');
const consoleLogHandler = require('./consoleLogHandler');
const { colors } = require('../data/consoleColors');

module.exports = async ({ interaction, errorType, commandName, error }) => {
    const errorEmbed = await errorEmbedCreator(errorType);
    console.log(
        colors.error +
            (await consoleLogHandler({
                interaction: interaction,
                errorType: errorType,
                commandName: commandName,
            }))
    );
    if (error) {
        console.log(colors.error + error);
    }
    console.log(
        colors.info +
            (await consoleLogHandler({
                interaction: interaction,
                errorType: 'debugInfo',
                commandName: commandName,
            }))
    );
    await interaction.editReply({ embeds: [errorEmbed] });
};
