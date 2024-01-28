require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const { MoonlinkManager } = require('moonlink.js');

const eventHandler = require('./handlers/eventHandler');
const { colors } = require('./data/consoleColors');

const TOKEN = process.env.TOKEN;
const URL = process.env.DB_URL;

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

async function databaseConnection() {
    try {
        if (!URL) {
            return;
        }

        await mongoose.connect(URL || '', {
            authSource: 'admin',
        });

        if (mongoose.connect) {
            console.log(colors.success + '[POLARIS STABLE] Polaris Success: Database connection established!');
        } else {
            console.log(colors.error + '[ERROR] [900] Failed to connect to database');
        }
    } catch (error) {
        console.log(colors.error + error);
    }
}
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

polaris.on('ready', () => {
    polaris.moon.init(polaris.user.id);
});

polaris.on('raw', (data) => {
    polaris.moon.packetUpdate(data);
});

databaseConnection();
eventHandler(polaris);

console.log(colors.success + '[POLARIS STABLE] Polaris Success: Bot Ready!');
polaris.login(TOKEN);
