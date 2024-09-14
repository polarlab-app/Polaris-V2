const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const userData = require('../../schemas/userData');
const { ApplicationCommandOptionType } = require('discord.js');
const items = require('../../data/items.json');

module.exports = {
    name: 'sell',
    description: 'Sell something from your inventory',
    options: [
        {
            name: 'item',
            description: 'The item to sell',
            type: ApplicationCommandOptionType.String,
            required: true,
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
            const item = await interaction.options.get('item').value;

            const itemIndex = user.inventory.findIndex((invItem) => invItem.item === item);
            if (user.inventory.find((invItem) => invItem.item === item).amount > 0) {
                await userData.findOneAndUpdate(
                    { id: interaction.user.id },
                    {
                        $inc: { bankBalance: +items[item] },
                    },
                    {
                        new: true,
                    }
                );
                if (itemIndex > -1) {
                } else {
                    user.inventory.push({ item: item, amount: 0 });
                }
                user.inventory[itemIndex].amount -= 1;
            }

            await user.save();

            const embed = await embedBuilder(module.exports.name, module.exports.module, [
                item,
                user.inventory.find((invItem) => invItem.item === item).amount,
                items[item],
            ]);
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
