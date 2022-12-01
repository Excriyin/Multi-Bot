const { Client, Collection, GatewayIntentBits, Partials, ActivityType, EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js"),
    Cluster = require("discord-hybrid-sharding"),
    Utils = require("../Handlers/Utils"),
    { connect } = require("mongoose"),
    { readdirSync } = require("fs"),
    { join } = require("path");

/**
 * The bot's client ;0
 * @extends {Client}
 * discord.js Client
 */

const Intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
]

module.exports = class Apera extends Client {
    constructor() {
        super({
            shardCount: Cluster.data.TOTAL_SHARDS,
            shards: Cluster.data.SHARD_LIST,
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false,
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages,
            ],
            ws: Intents,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.User,
                Partials.Reaction,
            ],
            presence: {
                activities: [{ name: "You", type: ActivityType.Watching, }],
                status: "online"
            }
        });
        this.cluster = new Cluster.Client(this);
        this.commands = new Collection();
        this.applicationCommands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.settings = require("../Configuration/Config");
        this.prefix = this.settings.Prefix;
        this.color = this.settings.EmbedColor;
        this.owners = this.settings.Owners;
        this.utils = new Utils(this);
        this.console = require("../Configuration/Consoler");
        if (!this.token) this.token = this.settings.Token;
        this._loadCommands();
        this._loadSlashCommands();
        this._loadClientEvents();
        this._loadGuildEvents();
        this._build();
    }
    /**
     * @returns {EmbedBuilder}
     */

    embed() {
        return new EmbedBuilder();
    };

    /**
     * @returns {ButtonBuilder}
     */

    button() {
        return new ButtonBuilder();
    };

    /**
     * @returns {SelectMenuBuilder}
     */

    menu() {
        return new SelectMenuBuilder();
    };
    /**
     * @returns {ActionRowBuilder}
     */

    rowbuilder() {
        return new ActionRowBuilder();
    };

    _loadCommands() {
        let count = 0
        readdirSync(join(__dirname, "..", "Commands", "Message")).forEach((folder) => {
            const commandFiles = readdirSync(join(__dirname, "..", "Commands", "Message", `${folder}`)).filter((files) => files.endsWith(".js"));
            for (const files of commandFiles) {
                const command = require(`../Commands/Message/${folder}/${files}`);
                if (command.category && command.category !== folder) command.category = folder;
                this.commands.set(command.name, command);
                if (command.aliases && Array.isArray(command.aliases)) for (const i of command.aliases) this.aliases.set(i, command.name);
                count++
            };
        });
        this.console.log(`Command Loaded: ${count}`, "cmd");
    };

    _loadSlashCommands() {
        let count = 0
        const commands = [];
        readdirSync(join(__dirname, "..", "Commands", "Application")).forEach((folder) => {
            const slashCommandFile = readdirSync(join(__dirname, "..", "Commands", "Application", `${folder}`)).filter((files) => files.endsWith(".js"));
            for (const files of slashCommandFile) {
                const slash_command = require(`../Commands/Application/${folder}/${files}`);
                if (!slash_command.name) throw new Error("Missing Slash Command Name: " + files.replace(".js", ""));
                if (!slash_command.description) throw new Error("Missing Slash Command Description: " + files.replace(".js", ""));
                commands.push(slash_command);
                this.applicationCommands.set(slash_command.name, slash_command);
                count++
            };
        });
        this.console.log(`Command Loaded: ${count}`, "Scmd");
        this.once("ready", async () => {
            try {
                await this.application.commands.set(commands);
            } catch (e) {
                this.console.log(e, "error");
            };
        });
    };
    _loadClientEvents() {
        let count = 0
        const eventFiles = readdirSync(join(__dirname, "..", "Events", "Client")).filter((files) => files.endsWith(".js"));
        for (const files of eventFiles) {
            const event = require(`../Events/Client/${files}`);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else { this.on(event.name, (...args) => event.execute(this, ...args)) };
            count++
        };
        this.console.log(`Loaded: ${count}`, "client");
    };
    _loadGuildEvents() {
        let count = 0
        const eventFiles = readdirSync(join(__dirname, "..", "Events", "Guild")).filter((files) => files.endsWith(".js"));
        for (const files of eventFiles) {
            const event = require(`../Events/Guild/${files}`);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else { this.on(event.name, (...args) => event.execute(this, ...args)) };
            count++
        };
        this.console.log(`Guild Loaded: ${count}`, "client");
    };
    _build() {
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4,
            useUnifiedTopology: true,
        };
        connect(this.settings.MongoData, dbOptions);
        this.console.log('[ DB ] DATABASE CONNECTED', "api");
        return super.login(this.token);
    };
}
