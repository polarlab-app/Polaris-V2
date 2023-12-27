require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");

const eventHandler = require("./handlers/eventHandler");
const { colors } = require("./data/consoleColors")

const TOKEN = process.env.TOKEN
const URL = process.env.DB_URL

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

function databaseConnection() {
  try {
    if (!URL) {
      return;
    }
  
    mongoose.connect(URL || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin"
    })
  
    if (mongoose.connect) {
      console.log(colors.success + '[POLARIS STABLE] Polaris Success: Database connection established!')
    } else {
      console.log(colors.error + '[ERROR] [900] Failed to connect to database')
    }
  } catch (error) {
    console.log(error) 
  }

}

databaseConnection();
eventHandler(polaris);

console.log(colors.success + "[POLARIS STABLE] Polaris Success: Bot Ready!");
polaris.login(TOKEN);
