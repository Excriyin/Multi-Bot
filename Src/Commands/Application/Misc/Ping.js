module.exports = new Object({
    name: "ping",
    description: "Returns the latency of the bot.",
    usage: "",
    cooldown: 10,
    sub_commands: [],
    permissions: {
        client: ["SendMessages"],
        user: []
    },
    category: "Misc",

    /**
     * 
     * @param {import("../../../Base/Apera")} client 
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(client, interaction, prefix, color) {
        return interaction.reply({ fetchReply: true, content: "Getting the latency..." }).then(({ createdTimestamp }) => {
            interaction?.editReply({
                content: null,
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription(`\`\`\`nim\nGateway Ping :: ${client.ws.ping} ms \nREST Ping    :: ${createdTimestamp - interaction.createdTimestamp} ms \`\`\``),
                ],
            });
        });
    }
})