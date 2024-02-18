const mongoose = require('mongoose');
const { colors } = require('../data/consoleColors');

module.exports = async function databaseConnection() {
    const URL = process.env.DB_URL;

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
};
