const { PermissionsBitField, Collection } = require("discord.js");

module.exports = new Object({
    name: "interactionCreate",
    /**
     * @param {import("../../Base/Apera")} client 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        let prefix = '` / `';
        if (interaction.isCommand()) {
            const color = client.color;
            const command = client.applicationCommands.get(interaction.commandName);
            if (!command) return;
            //Auto Permission Return
            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.Flags.SendMessages)) return;
            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.Flags.ViewChannel)) return;
            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.Flags.EmbedLinks)) return await interaction.reply({ content: `I don't have **\`EMBED_LINKS\`** permission to execute this **\`${command.name}\`** command.`, ephemeral: false }).catch(() => { });
            //Permission for handler
            if (command.permissions) {
                if (command.permissions.client) {
                    if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.resolve(command.permissions.client) || [])) return await interaction.reply({ content: `I don't have enough permissions to execute this command.`, ephemeral: false });
                };
                if (command.permissions.user) {
                    if (!interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.resolve(command.permissions.user) || [])) return await interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: false });
                }
            };
            //developer
            if (command.dev) {
                if (client.owners) {
                    const findDev = client.owners.find((x) => x === interaction.member.user.id);
                    if (!findDev) return interaction.reply({ content: `Sorry! This is a owner based command you cant use it.` });
                };
            };
            if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection());
            const cooldown = client.cooldowns.get(command.name);
            let cooldownAmount = command.cooldown && command.cooldown > 0 ? (command.cooldown) * 1000 : 3000;
            if (cooldown.has(interaction.member.user.id)) {
                let expiretime = cooldown.get(interaction.member.user.id);
                let timeleft = cooldownAmount - (Date.now() - expiretime);
                if (timeleft > 0) return await interaction.reply({ embeds: [client.embed().setDescription(`Please wait for \`[ ${client.utils.msToTime(timeleft)} ]\` before reusing the \`${command.name}\` command!`).setColor(color)] })
            } else {
                cooldown.set(interaction.member.user.id, Date.now());
            };
            setTimeout(() => { if (cooldown.has(interaction.member.user.id)) return cooldown.delete(interaction.member.user.id); }, cooldownAmount);
            try {
                await command.execute(client, interaction, prefix, color);
            } catch (error) {
                console.log(error)
                if (interaction.replied) {
                    await interaction.editReply({ content: `Unexpected exception:\n\`\`\`js\n${error}\`\`\`` }).catch(() => { });
                } else {
                    await interaction.followUp({ ephemeral: true, content: `An unexcepted error occured.` }).catch(() => { });
                }
                console.error(error);
            };
        }
    },
})