const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "Returns the help commands of the bot",
    aliases: ["h"],
    usage: "",
    dev: false,
    args: false,
    cooldown: 10,
    sub_commands: [],
    permissions: {
        client: [],
        user: []
    },
    category: "Info",
  /**
     * 
     * @param {import("../../../Base/MultiBot")} client 
     * @param {import("discord.js").Message} message 
     * @param {String[]} args 
     * @param {String} prefix 
     * @param {String} color
     */
  
  execute: async (client, message, args, prefix, color) => {

    const embed = new EmbedBuilder()
    .setTitle(`${client.user.username} Help`)
    .setDescription(`Hey**<@${message.author.id}>**, I'm <@${client.user.id}>!\n\nA Discord Multipurpose bot with many awesome commands!\n\n\`🗒️\`•Information\n\`⚙️\`•Config\n\n*Choose an category below button to see commands.*\n\n`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(color)
    .setTimestamp()
    .setFooter({text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                
    let but1 = new ButtonBuilder().setCustomId("home").setLabel("Home").setStyle(ButtonStyle.Success)
  
    let but2 = new ButtonBuilder().setCustomId("info").setLabel("Info").setStyle(ButtonStyle.Primary)
      
    let but3 = new ButtonBuilder().setCustomId("misc").setLabel("Misc").setStyle(ButtonStyle.Primary);

     let _commands;
     let editEmbed = new EmbedBuilder();
     
    const m = await message.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(but1, but2, but3)] });

    const collector = m.createMessageComponentCollector({
      filter: (b) => {
      if(b.user.id === message.author.id) return true;
       else {
     b.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this button, run the command again to use the help menu.`}); return false;
           };
      },
      time : 60000,
      idle: 60000/2
    });
    collector.on("end", async () => {
		 if(!m) return;
        await m.edit({ components: [new ActionRowBuilder().addComponents(but1.setDisabled(true), but2.setDisabled(true), but3.setDisabled(true))] }).catch(() => {});
    });
    collector.on('collect', async (b) => {
       if(!b.deferred) await b.deferUpdate()
        if(b.customId === "home") {
           if(!m) return;
           return await m.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(but1, but2, but3)] })
        }
         if(b.customId == "info") {
         _commands = client.commands.filter((x) => x.category && x.category === "Info").map((x) => `\`${x.name}\``);
             editEmbed.setColor(color).setDescription(_commands.join(", ")).setTitle("Information Commands").setFooter({text: `Total ${_commands.length} information commands.`})
          return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3)] })
         }
         if(b.customId == "misc") {
         _commands = client.commands.filter((x) => x.category && x.category === "Misc").map((x) => `\`${x.name}\``);
             editEmbed.setColor(color).setDescription(_commands.join(", ")).setTitle("Miscellenaeous Commands").setFooter({text: `Total ${_commands.length} miscellenaeous commands.`})
          return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(but1, but2, but3)] })
         
        }
     });
   }
 }