const config = require('../../config.json');
const { colors } = require('../../data/consoleColors');

module.exports = async (polaris) => {
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  await timer(400);
  console.log(colors.regular + `Logged in as: ${polaris.user.tag}`);
  console.log(colors.regular + `Current Ping: ${polaris.ws.ping}ms`);
  console.log(colors.regular + `Current OS: ${process.platform}`);
  console.log(
    colors.regular + `Discord.JS Version: ${require('discord.js').version}`
  );
  console.log(colors.regular + `Polaris Version: ${config.version}`);
  console.log(colors.regular + `Polar API Version: V1.2.6`);
  console.log(colors.regular + `Current Prefix: /`);
  console.log('ᅠᅠ');
};
