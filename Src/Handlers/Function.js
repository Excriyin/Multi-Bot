const { EmbedBuilder } = require("discord.js"),
    prefixSchema = require("../Models/Prefix");

/**
 * 
 * @param {String} id 
 * @param {Client} client
 * @returns {String}
 */
async function getPrefix(id, client) {
    let prefix = client.prefix;
    let data = await prefixSchema.findOne({ _id: id });
    if (data && data.prefix) prefix = data.prefix;

    return prefix;
};

/**
 * 
 * @param {String} commandName 
 * @param {Message} message 
 * @param {String} args
 * @param {Client} client 
 */

async function invalidArgs(commandName, message, args, client) {
    try {
        let color = client.color ? client.color : "BLURPLE";
        let prefix = await getPrefix(message.guildId, client);
        let command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
        if (!command) return await message.reply({
            embeds: [new EmbedBuilder().setColor(color).setDescription(args)], allowedMentions: {
                repliedUser: false
            }
        }).catch(() => { });
        let embed1 = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: message.author.tag.toString(), iconURL: message.author.displayAvatarURL({ dynamic: true }).toString() })
            .setDescription(`**${args}**`)
            .setTitle(`__${command.name}__`)
            .addFields([
                {
                    name: "Usage",
                    value: `\`${command.usage ? `${prefix}${command.name} ${command.usage}` : `${prefix}${command.name}`}\``,
                    inline: false
                }, {
                    name: "Example(s)",
                    value: `${command.examples ? `\`${prefix}${command.examples.join(`\`\n\`${prefix}`)}\`` : "`" + prefix + command.name + "`"}`
                }
            ]);

        return await message.reply({
            embeds: [embed1],
        });
    } catch (e) {
        console.error(e);
    };
};


module.exports = {
    getPrefix,
    invalidArgs,
};