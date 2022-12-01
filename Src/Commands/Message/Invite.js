const Discord = require("discord.js");

module.exports = {
    name: "invite",
    description: "Returns the link of the bot",
    aliases: ["link"],
    usage: "",
    dev: false,
    cooldown: 10,
    sub_commands: [],
    permissions: {
        client: ["EmbedLinks"],
        user: []
    },
    category: "Misc",

    /**
     * 
     * @param {import("../../../Base/MultiBot")} client 
     * @param {import("discord.js").Message} message 
     * @param {String[]} args 
     * @param {String} prefix 
     * @param {String} color
     */

    execute: async (client, message, args, prefix, color) => {

        let embed = new Discord.EmbedBuilder()
        .setTitle("Invite Me")
        .setColor(color)
        .setDescription(
          "**Get MultiBot's Invite Link [Here](https://discord.com/oauth2/authorize?client_id=1047918296827183175&permissions=1584921983&scope=bot)**\n**Need assistance? Join our [Support Server](https://discord.gg/eCVabJbaFN) now!**"
        )
      message.channel.send({ embeds: [embed] });
    },
};