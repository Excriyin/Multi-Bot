const { ApplicationCommandOptionType } = require("discord.js");

module.exports = new Object({
    name: "purge",
    description: "purge the amount of messages",
    usage: "",
    cooldown: 10,
    permissions: {
        client: ["ManageMessages"],
        user: ["ManageMessages"]
    },
    category: "Misc",
    options: [
        {
            name: 'number',
            description: '1-100',
            required: true,
            type: ApplicationCommandOptionType.Number
        }
    ],
    /**
     * 
     * @param {import("../../../Base/MultiBot")} client 
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(client, interaction, args) {
        const msgnum = interaction.options.getNumber('number')
        await interaction.channel.bulkDelete(msgnum);
        interaction.reply({ content: "Done!, You can delete this now.", ephemeral: true });
   }
 })