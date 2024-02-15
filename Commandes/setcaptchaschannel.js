const Discord = require("discord.js");

module.exports = {
    name: "setcaptchachannel",
    description: "Set le salon pour le captcha",
    longdescription: "Set le salon pour le captcha. Le nouveau venu aurras un accès temporaire au salon, il pourra voir le salon ainsi que son historique et écrire des messages. Ces permissions disparraitrons après le captcha.",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "channel",
        name: "salon",
        description: "Le salon ou le bot va mettre le captcha",
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let channel = args.getChannel("salon");

            channel.name = bot.function.securiser(channel.name);
            message.guild.name = bot.function.securiser(message.guild.name);

            db.query(`UPDATE captcha SET channelID = ${channel.id}, channelName = '${channel.name}' WHERE guildID = ${message.guild.id}`);

            console.log(`Le salon désormais utiliser pour les captchas sur le serveur "${message.guild.name}" est "${channel.name}"`);
            return bot.msg(message, `Le salon désormais utiliser pour les captchas est ${channel}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}