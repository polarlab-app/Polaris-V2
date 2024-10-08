const config = require('../../config.json');
const { colors } = require('../../data/consoleColors');

module.exports = async (polaris) => {
    console.log(colors.regular + `Logged in as: ${polaris.user.tag}`);
    console.log(colors.regular + `Current Ping: ${polaris.ws.ping}ms`);
    console.log(colors.regular + `Current OS: ${process.platform}`);
    console.log(colors.regular + `Discord.JS Version: ${require('discord.js').version}`);
    console.log(colors.regular + `Polaris Version: ${config.version}`);
    console.log(colors.regular + `Polar API Version: V2.1.7`);
    console.log(colors.regular + `Current Prefix: /`);
    console.log('ᅠᅠ');
};
