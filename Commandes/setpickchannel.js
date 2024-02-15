const Discord = require("discord.js");

module.exports = {
    name: "setpickchannel",
    description: "Set le salon où les picks pourrons avoir lieux",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "channel",
        name: "channel",
        description: "Le salon où les picks pourrons avoir lieux",
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let channel = args.getChannel("channel");

            channel.name = bot.function.securiser(channel.name);
            message.guild.name = bot.function.securiser(message.guild.name);

            db.query(`UPDATE pick SET pickChannelID = ${channel.id}, pickChannelName = '${channel.name}' WHERE guildID = ${message.guild.id}`);

            console.log(`Le salon ou les picks aurons désormais lieux sur le serveur ${message.guild.name} est ${channel.name}`);
            return bot.msg(message, `Le salon ou les picks aurons désormais lieux est ${channel}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}