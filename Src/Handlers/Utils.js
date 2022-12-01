const { EmbedBuilder } = require("discord.js");
const prefixSchema = require("../Models/Prefix");

module.exports = class Utils {
    constructor(client) {
        this.client = client;
    }
    /**
     * @param {String} id 
     * @param {import("./Index")} client
     * @returns {String}
     */

    async getPrefix(id, client) {
        let prefix = client.prefix;
        let data = await prefixSchema.findOne({ _id: id });
        if (data && data.prefix) prefix = data.prefix;
        return prefix;
    };

    /**
     * @param {TextChannel} channel 
     * @param {String} args 
     * @param {String} color
     */

    async oops(channel, args, color) {
        try {
            let embed = new EmbedBuilder().setColor(color ? color : "BLURPLE").setDescription(`${args}`);
            const m = await channel.send({ embeds: [embed] });
            setTimeout(async () => await m.delete().catch(() => { }), 12000);
        } catch (e) {
            return console.error(e)
        }
    };

    /**
     * @param {String} id
     * @param {String} commandName 
     * @param {Message} message 
     * @param {String} args
     * @param {import("./Index")} client 
     */

    async invalidArgs(commandName, message, args, id) {
        try {
            const clientz = require("../Index")
            let color = clientz.color ? clientz.color : "BLURPLE";
            let prefix = clientz.prefix;
            let data = await prefixSchema.findOne({ _id: id });
            if (data && data.prefix) prefix = data.prefix;
            let command = clientz.commands.get(commandName) || clientz.commands.get(clientz.aliases.get(commandName));
            if (!command) return await message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(args)] }).catch(() => { });
            let embed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: message.author.tag.toString(), iconURL: message.author.displayAvatarURL({ dynamic: true }).toString() })
                .setDescription(`**${args}**`)
                .setTitle(`__${command.name}__`)
                .addFields([
                    {
                        name: "Usage",
                        value: `\`${command.usage ? `${prefix}${command.name} ${command.usage}` : `${prefix}${command.name}`}\``,
                        inline: false
                    },
                    {
                        name: "Example(s)",
                        value: `${command.examples ? `\`${prefix}${command.examples.join(`\`\n\`${prefix}`)}\`` : "`" + prefix + command.name + "`"}`
                    }
                ]);
            return await message.reply({
                embeds: [embed],
            });
        } catch (e) {
            console.error(e);
        };
    };
    /**
     * 
     * @param {Message} msg 
     * @param {String} args 
     * @param {String} color 
     * @returns {Promise<Message | void>}
     */

    async replyOops(msg, args, color) {
        const config = require("../Configuration/Config")
        if (!msg) return;
        if (!args) return;
        if (!color) color = config.EmbedColor;
        let embed = new EmbedBuilder().setColor(color).setDescription(`${args}`);
        let m = await msg.reply({ embeds: [embed] });
        setTimeout(async () => {
            if (m && m.deletable) await m.delete().catch(() => { });
        }, 7000);
    };

    /**
     * 
     * @param {import("discord.js").CommandInteraction | import("discord.js").ButtonInteraction | import("discord.js").SelectMenuInteraction} interaction 
     * @param {String} args 
     * @param {String} color
     */

    async intReply(interaction, args, color) {
        const config = require("../Configuration/Config")
        if (typeof color !== "string") color = config.EmbedColor;
        if (!interaction) return;
        if (interaction.replied) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).catch(() => { });
        } else {
            return await interaction.followUp({
                ephemeral: true,
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).catch(() => { });
        };
    };

    /**
     * @param {import("discord.js").CommandInteraction | import("discord.js").ButtonInteraction | import("discord.js").SelectMenuInteraction} interaction 
     * @param {String} args 
     * @param {String} color
     */

    async intOops(interaction, args, color) {
        const config = require("../Configuration/Config")
        if (typeof color !== "string") color = config.EmbedColor;
        if (!interaction) return;
        if (interaction.replied) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).then((msg) => { setTimeout(() => { msg.delete(); }, 10000) }).catch(() => { });
        } else {
            return await interaction.followUp({
                ephemeral: true,
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).then((msg) => { setTimeout(() => { msg.delete(); }, 10000) }).catch(() => { });
        };
    };

    ConvertDuration(milliseconds) {
        const
            hours = milliseconds / (1000 * 60 * 60),
            absoluteHours = Math.floor(hours),
            h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours,
            minutes = (hours - absoluteHours) * 60,
            absoluteMinutes = Math.floor(minutes),
            m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes,
            seconds = (minutes - absoluteMinutes) * 60,
            absoluteSeconds = Math.floor(seconds),
            s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
        return (h == 0 && m == 0) ? ('00:' + s) : (h == 0) ? (m + ':' + s) : (h + ':' + m + ':' + s);
    }
    /**
     * @param {*} arr 
     * @param {*} size 
     * @returns 
     */
    chunk(arr, size) {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    }

    //create function ms to hms
    msToTime(duration) {
        let milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? hours : hours;
        minutes = (minutes < 10) ? minutes : minutes;
        seconds = (seconds < 10) ? seconds : seconds;
        milliseconds = (milliseconds < 10) ? milliseconds : milliseconds;

        if (duration >= 3600000) {
            return hours + "h " + minutes + "m " + seconds + "s";
        } else if (duration >= 60000) {
            return minutes + "m " + seconds + "s";
        } else if (duration >= 1000) {
            return seconds + "s";
        } else {
            return milliseconds + "ms";
        }
    }
}