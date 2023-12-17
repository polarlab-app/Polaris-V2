module.exports = {
    name: 'test',
    description: 'test',
    module: 'disableddemo',

    botPermissions: [],
    permissionsRequired: [],

    callback: async (polaris, interaction) => {
        interaction.editReply("test")
    }
}