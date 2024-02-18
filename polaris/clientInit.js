const { Client, IntentsBitField } = require('discord.js');

module.exports = async function clientInit() {
    try {
        const client = await new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildEmojisAndStickers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildVoiceStates,
            ],
        });

        return client;
    } catch (error) {
        console.log(error);
    }
};
