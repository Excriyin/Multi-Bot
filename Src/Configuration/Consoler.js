const chalk = require("chalk");
module.exports = class Console {
    static log(content, type = "log") {
        switch (type) {
            case "log": { return console.log(`• ${chalk.whiteBright(`[ Log ]`)} ${chalk.blueBright(chalk.italic("=> ") + content)}`) }
            case "warn": { return console.log(`• ${chalk.redBright(`[ Warn ]`)} ${chalk.blueBright(chalk.italic("=> ") + content)}`) }
            case "error": { return console.log(`• ${chalk.red(`[ Error ]`)} ${chalk.blueBright(chalk.italic("=> ") + content)}`) }
            case "debug": { return console.log(`• ${chalk.green(`[ Debug ]`)} ${chalk.blueBright(chalk.italic("=> ") + content)}`) }
            case "cmd": { return console.log(`• ${chalk.cyan(`[ Message ]`)} ${chalk.blueBright(chalk.italic("=> ") + content)}`) }
            case "Scmd": { return console.log(`• ${chalk.cyan(`[ Slash ]`)} ${chalk.blueBright(chalk.italic("  => ") + content)}`) }
            case "event": { return console.log(`• ${chalk.greenBright(`[ Event ]`)} ${chalk.blueBright(chalk.italic("  => ") + content)}`) }
            case "lavalink": { return console.log(`• ${chalk.greenBright(chalk.italic(`[ LavaLink ]`))} ${chalk.blueBright(("=> " + content))}`) }
            case "client": { return console.log(`• ${chalk.yellow(`[ Client ]`)} ${chalk.blueBright(chalk.italic(" => ") + content)}`) }
            case "api": { return console.log(`• ${chalk.magenta(`[ Api ]`)} ${chalk.blue(chalk.italic("    => ") + content)}`) }
            case "player": { return console.log(`• ${chalk.yellow(`[ Player ]`)} ${chalk.blue(chalk.italic(" => ") + content)}`) }
            case "node": { return console.log(`• ${chalk.gray(`[ Node ]`)} ${chalk.blue(chalk.italic("   => ") + content)}`) }
            default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
        }
    }
};