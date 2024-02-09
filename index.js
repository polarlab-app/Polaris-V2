require('dotenv').config();
const { MoonlinkManager } = require('moonlink.js');
const { Client, IntentsBitField } = require('discord.js');

const databaseConnection = require('./polaris/databaseConnection');
const eventHandler = require('./handlers/eventHandler');

const { colors } = require('./data/consoleColors');
const TOKEN = process.env.TOKEN;

console.log(colors.regular + 'Starting...');

const polaris = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});

polaris.moon = new MoonlinkManager(
    [
        {
            host: '0.0.0.0',
            port: 2333,
            secure: false,
            password: 'youshallnotpass',
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
polaris.login(TOKEN);
