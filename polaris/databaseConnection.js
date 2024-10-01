const mongoose = require('mongoose');
const { colors } = require('../data/consoleColors');

module.exports = async function databaseConnection() {
    try {
        if (!process.env.DB_URL) {
            return;
        }

        await mongoose.connect(process.env.DB_URL || '', {
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
};
