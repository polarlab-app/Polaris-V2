/*const { EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType, CommandInteraction } = require('discord.js');

const { Client } = require('aghpb');

const client = new Client();

module.exports = {
    name: 'aghpb',
    description: 'Returns anime girls holding programming books.',
    module: 'fun',

    permissionsRequired: [],
    botPermissions: [],

    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'random',
            description: 'Returns a random book.',
        },
    ],

    /**
     * Returns anime girls!!! 💀
     * Also I couldn't survive one second without the code editor guidance from type annotations. THIS IS WHY I HATE JAVASCRIPT WHY ARE TYPES NOT A THING!!!!!!! DO YOU WANT YOUR CODE TO BLOW UP!?!?
     * @param {CommandInteraction} interaction
     */
/*callback: async (polaris, interaction) => {
        if (interaction.options.getSubcommand() === 'random') {
            const book = await client.random();

            const bookImage = new AttachmentBuilder(Buffer.from(book.image), {
                name: 'image.png',
            });

            const bookDescription = `
### **Metadata:**
- 📖 **Category: \`\`${book.category}\`\`**
- 📅 **Date Added: <t:${book.dateAdded.getTime() / 1000}>**
            `;

            const bookEmbed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setTitle(`🗒️ ${book.name}`)
                .setDescription(bookDescription)
                .setImage('attachment://image.png');

            await interaction.editReply({ embeds: [bookEmbed], files: [bookImage] });
        }

        /// TODO: More subcommands maybe... if I'm not lazy...
    },
};*/
