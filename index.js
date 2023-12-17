require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");

const eventHandler = require("./handlers/eventHandler");
const { colors } = require("./data/consoleColors")

console.log(colors.regular + "Starting...");

const polaris = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates
  ],
});


// databaseConnection();
eventHandler(polaris);

console.log(colors.success + "[POLARIS STABLE] Polaris Success: Bot Ready!");
polaris.login(process.env.TOKEN);
