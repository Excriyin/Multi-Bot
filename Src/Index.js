const { Manager } = require("discord-hybrid-sharding"),
    { Token } = require("./Configuration/Config");

const manager = new Manager("./src/Bot.js", {
    mode: "process",
    shardsPerClusters: 4,
    token: Token,
    totalClusters: "auto",
    totalShards: "auto",
});

manager.spawn({ timeout: -1 });
