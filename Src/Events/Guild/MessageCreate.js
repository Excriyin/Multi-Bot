const { ChannelType, PermissionsBitField, Collection } = require("discord.js");
const { invalidArgs } = require("../../Handlers/Function");

module.exports = new Object({
    name: "messageCreate",
    /**
     * @param {import("../../Apera")} client
     * @param {import("discord.js").Message} message
     */
    async execute(client, message) {
        if (message.author.bot || message.webhookId || !message.guild || !message.channel) return;
        if (message.channel.type == ChannelType.DM || message.channel.type == ChannelType.GuildForum) return;
        if (message.partial) await message.fetch();
        const prefix = await client.utils.getPrefix(message.guildId, client);
        const color = client.color;
        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            if (message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) {
                return await message.reply({
                    embeds: [client.embed().setDescription(`Hey, my prefix for this server is \` ${prefix} \` Want more info? then do \` ${prefix} \`\nStay Safe, Stay Awesome!`).setColor(color)]
                }).catch(() => { });
            };
        };
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
        if (!command) return;
        //Auto Permission Return
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) return await message.author.send({ content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.ViewChannel)) return;
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.EmbedLinks)) return await message.reply({ content: `I don't have **\`EMBED_LINKS\`** permission to execute this **\`${command.name}\`** command.` }).catch(() => { });
        // Permission for handler
        if (command.permissions) {
            if (command.permissions.client) {
                if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.resolve(command.permissions.client) || [])) return await client.utils.oops(message.channel, `I don't have \`${(command.permissions.client).join(", ")}\` permission(s) to execute this command.`, color);
            };
            if (command.permissions.user) {
                if (!message.guild.members.cache.get(message.author.id).permissionsIn(message.channel).has(PermissionsBitField.resolve(command.permissions.client) || [])) return await client.utils.oops(message.channel, `You don't have \`${(command.permissions.user).join(", ")}\` permissions to use this command.`, color);
            }
        };
        //developer
        if (command.dev) {
            if (client.owners) {
                const findDev = client.owners.find((x) => x === message.author.id);
                if (!findDev) return message.reply({ content: `Sorry! This is a owner based command you cant use it.` });
            };
        };

        if (command.args) {
            if (!args.length) return await invalidArgs(command.name, message, "Please provide the required arguments.", client);
        };

        if (!client.cooldowns.has(command.name)) {
            client.cooldowns.set(command.name, new Collection());
        };
        const cooldown = client.cooldowns.get(command.name);
        let cooldownAmount = command.cooldown && command.cooldown > 0 ? (command.cooldown) * 1000 : 3000;
        if (cooldown.has(message.author.id)) {
            let expiretime = cooldown.get(message.author.id);
            let timeleft = cooldownAmount - (Date.now() - expiretime);

            if (timeleft > 0) return await client.utils.oops(message.channel, `Please wait for \`[ ${client.utils.msToTime(timeleft)} ]\` before reusing the \`${command.name}\` command!`, color);
        } else {
            cooldown.set(message.author.id, Date.now());
        };

        setTimeout(() => { if (cooldown.has(message.author.id)) return cooldown.delete(message.author.id); }, cooldownAmount);
        try {
            return await command.execute(client, message, args, prefix, color);
        } catch (error) {
            await message.channel.send({ content: "An unexpected error occured, the developers have been notified!" }).catch(() => { });
            console.error(error);
        };
    },
});
