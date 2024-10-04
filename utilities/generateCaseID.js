const crypto = require('crypto');

module.exports = () => {
    return crypto.randomBytes(6).toString('hex');
};
