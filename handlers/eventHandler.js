const path = require('path');
const getAllFiles = require('../utilities/getAllFiles');

module.exports = async (polaris) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);

        const eventName = path.basename(eventFolder);

        if (eventName.startsWith('moonlink')) {
            polaris.moon.on(eventName.split('.')[1], async (arg, arg2, arg3, arg4) => {
                for (const eventFile of eventFiles) {
                    const eventFunction = require(eventFile);
                    await eventFunction(polaris, arg, arg2, arg3, arg4);
                }
            });
            continue;
        }

        polaris.on(eventName, async (arg, arg2, arg3, arg4) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(polaris, arg, arg2, arg3, arg4);
            }
        });
    }
};
