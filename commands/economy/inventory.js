const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { EmbedBuilder } = require('discord.js');

const userData = require('../../schemas/userData');

module.exports = {
    name: 'inventory',
    description: 'View the contents of your inventory',
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await userData.findOne({ id: interaction.user.id });
            const embed = new EmbedBuilder().setTitle(` Inventory`).setDescription(`Here are your items:`);

            for (let i = 0; i < user.economy.inventory.length; i++) {
                const item = user.economy.inventory[i];
                embed.addFields({ name: `${item.item}`, value: `Quantity: ${item.amount}` });
            }
            // const embed = await embedBuilder(module.exports.name, module.exports.module,[await polaris.ws.ping])
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
