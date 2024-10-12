require('dotenv').config();

const { MoonlinkManager } = require('moonlink.js');
const databaseConnection = require('./polaris/databaseConnection');
const eventHandler = require('./handlers/eventHandler');
const { colors } = require('./data/consoleColors');
const clientInit = require('./polaris/clientInit');

console.log(colors.regular + 'Starting...');

const polaris = clientInit();

polaris.moon = new MoonlinkManager(
    [
        {
            host: process.env.LAVALINK_HOST,
            port: parseInt(process.env.LAVALINK_PORT),
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
