const guildData = require('../../schemas/guildData');
const generateCaseID = require('../../utilities/generateCaseID');

module.exports = async (polaris, oldChannel, newChannel) => {
    const guild = await guildData.findOne({ id: newChannel.guild.id });
    const channelIndex = guild.data.channels.findIndex((c) => c.id === oldChannel.id);
    if (channelIndex !== -1) {
        guild.data.channels[channelIndex].name = newChannel.name;
        guild.data.channels[channelIndex].position = newChannel.rawPosition;
    } else {
        guild.data.channels.push({
            id: newChannel.id,
            name: newChannel.name,
            type: newChannel.type,
            position: newChannel.rawPosition,
        });
    }
    guild.markModified('data.channels');
    await guild.save();
};
