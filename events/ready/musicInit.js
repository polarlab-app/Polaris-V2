module.exports = async (polaris) => {
    await polaris.moon.init(polaris.user.id);
};
