const guildData = require('../../schemas/guildData')

module.exports = async (polaris, guild) => {
    let guildCheck = await guildData.findOne({id: `${guild.id}`})
    if (guildCheck) {
        return;
    }

    await guildData.create({
        id: `${guild.id}`,
        name: `${guild.name}`,
        icon: `${guild.iconURL()}`,
        description: `${guild.description}`,
        data: [
            {
                name: 'memberCount',
                value: `${guild.memberCount}`
            }
        ]
    })
    console.log('Create guild entry')
}