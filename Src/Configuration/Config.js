const { ButtonStyle } = require("discord.js");
require("dotenv").config();
module.exports = {
    Token: process.env.Token || "", //Here Goes Your TOKEN
    Prefix: process.env.Prefix || "m!", //Here Goes Your Prefix
    Client: {
        ID: process.env.ClientID || "", //Here Goes Your Bot Client Id
        Secret: process.env.ClientSecret || "" //Here Goes Your Bot Client Secret
    },
    button: {
        "styles": {
            "grey": ButtonStyle.Secondary,
            "blue": ButtonStyle.Primary,
            "link": ButtonStyle.Link,
            "red": ButtonStyle.Danger,
            "green": ButtonStyle.Success
        }
    },
    MongoData: process.env.MongoDB || "", //Here Goes Your MongoDb Url
    EmbedColor: process.env.EmbedColor || "#0394fc", //Here Goes Your EmbedColor
    Owners: ["785682740266926080"],
    links: {
        invite: "https://github.com/Excriyin/Multi-Bot",
        bg: "https://github.com/Excriyin/Multi-Bot",
        support: "https://github.com/Excriyin/Multi-Bot",
        vote: "https://github.com/Excriyin/Multi-Bot"
    }
}
