const { ButtonStyle } = require("discord.js");
require("dotenv").config();
module.exports = {
    Token: process.env.Token || "", //Here Goes Your TOKEN
    Prefix: process.env.Prefix || "?", //Here Goes Your Prefix
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
    EmbedColor: process.env.EmbedColor || "#10a464", //Here Goes Your EmbedColor
    Owners: ["588659781930188811"],
    links: {
        invite: "https://github.com/Fluid-Devs/V14-handler",
        bg: "https://github.com/Fluid-Devs/V14-handler",
        support: "https://github.com/Fluid-Devs/V14-handler",
        vote: "https://github.com/Fluid-Devs/V14-handler"
    }
}
