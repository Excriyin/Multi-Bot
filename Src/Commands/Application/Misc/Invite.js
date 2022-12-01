const { EmbedBuilder, CommandInteraction, ButtonStyle, Client, ButtonBuilder, ActionRowBuilder } = require("discord.js")
module.exports = new Object({
    name: "invite",
    description: "Returns the invite of the bot.",
    usage: "",
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
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(client, interaction, prefix, color) {
        await interaction.deferReply({
            ephemeral: false
        });

        const mainPage = new EmbedBuilder()
        .setAuthor({ name: 'MultiBot', iconURL: 'https://cdn.discordapp.com/attachments/1023590385714483230/1047908504284958830/pngkey.com-discord-icon-png-1495314.png'})
        .setThumbnail('https://cdn.discordapp.com/attachments/1023590385714483230/1047908504284958830/pngkey.com-discord-icon-png-1495314.png')
        .setColor(color)
         .addFields([{ name: 'Invite Multibot', value: `[Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot)`}])
         await interaction.followUp({embeds: [mainPage]})
}
})
