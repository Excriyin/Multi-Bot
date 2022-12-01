module.exports = {
    name: "ping",
    description: "Returns the latency of the bot.",
    aliases: ["pong"],
    usage: "",
    dev: false,
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
     * @param {import("discord.js").Message} message 
     * @param {String[]} args 
     * @param {String} prefix 
     * @param {String} color
     */

    execute: async (client, message, args, prefix, color) => {
        return message.channel.send({ content: "Getting the latency..." }).then((msg) => {
            msg.edit({
                content: null,
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription(`\`\`\`nim\nGateway Ping :: ${client.ws.ping} ms \nREST Ping    :: ${msg.createdTimestamp - message.createdTimestamp} ms \`\`\``),
                ],
            });
        });
    }
}