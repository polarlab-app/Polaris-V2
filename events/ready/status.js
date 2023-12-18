const { ActivityType } = require("discord.js");
const config = require('../../config.json')

module.exports = async ( polaris ) => {
    polaris.user.setActivity({
        name: config.version,
        type: ActivityType.Playing,
    });
};