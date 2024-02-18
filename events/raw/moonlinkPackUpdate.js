module.exports = async (polaris, data) => {
    await polaris.moon.packetUpdate(data);
};
