const consoleLogHandler = require('../../handlers/consoleLogHandler');

module.exports = async (polaris) => {
    setInterval(async () => {
        await consoleLogHandler({ polaris: polaris, errorType: 'pinging' });
    }, 600000);
};
