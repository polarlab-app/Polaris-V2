require('dotenv').config();
const { MoonlinkManager } = require('moonlink.js');
const { Client, IntentsBitField } = require('discord.js');

const databaseConnection = require('./polaris/databaseConnection');
const eventHandler = require('./handlers/eventHandler');

const { colors } = require('./data/consoleColors');

console.log(colors.regular + 'Starting...');

const polaris = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildEmojisAndStickers,
    ],
});

polaris.moon = new MoonlinkManager(
    [
        {
            host: process.env.LAVALINK_HOST,
            port: process.env.LAVALINK_PORT,
            secure: false,
            password: process.env.LAVALINK_PASSWORD,
        },
    ],
    {},
    (guild, sPayload) => {
        polaris.guilds.cache.get(guild).shard.send(JSON.parse(sPayload));
    }
);

databaseConnection();
eventHandler(polaris);

console.log(colors.success + '[POLARIS STABLE] Polaris Success: Bot Ready!');
polaris.login(process.env.TOKEN);
