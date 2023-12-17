const path = require('path');
const getAllFiles = require('../utilities/getAllFiles');

module.exports = async (polaris, pool) => {
    const eventFolders = getAllFiles(path.join(__dirname, "..", 'events'), true);
    
    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);

        const eventName = eventFolder.replace(/\\/g, '/.').split('.').pop();

        polaris.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(polaris, arg);
            }
        })
    }
}