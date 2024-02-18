const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const userData = require('../../schemas/userData');
const getRandomLoot = require('../../utilities/getRandomLoot');
const { digging } = require('../../data/loot.json');

module.exports = {
    name: 'dig',
    description: 'Try digging in the dirt for loot!',
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const lootItem = await getRandomLoot(digging);
            const user = await userData.findOne({ id: interaction.user.id });

            if (!user) {
                user = new userData({
                    id: interaction.user.id,
                    purse_balance: 0,
                    bank_balance: 0,
                    inventory: [],
                });
                await user.save();
                await errorHandler({
                    interaction: interaction,
                    errorType: 'nonExistentUser',
                    commandName: module.exports.name,
                });
                return;
            }
            const lootObj = { item: lootItem, amount: 1 };
            const itemIndex = await user.inventory.findIndex((invItem) => invItem.item === lootObj.item);
            if (itemIndex > -1) {
                user.inventory[itemIndex].amount = user.inventory[itemIndex].amount + lootObj.amount;
            } else {
                await user.inventory.push(lootObj);
            }

            await user.save();

            const embed = await embedBuilder('dig', `${module.exports.module}`, [lootItem]);
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
