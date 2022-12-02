module.exports = {
    name: "clear",
    description: "delete the given number of messages",
    aliases: ["purge", "delete"],
    usage: "",
    dev: false,
    args: false,
    cooldown: 10,
    sub_commands: [],
    permissions: {
        client: ["ManageMessages"],
        user: ["ManageMessages"]
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

    const fetched = message.channel || message.mentions.members.first();
    let messageArray = message.content.split(" ");
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.channel.send(
        `${message.author.username}, you can only clear messages from 1-99`
      );
    } else if (amount <= 1 || amount > 100) {
      return message.channel.send(
        `${message.author.username}, you can only clear messages from 1-99`
      );
    }

    fetched.bulkDelete(amount, true);
    fetched.bulkDelete(amount);
  },
};