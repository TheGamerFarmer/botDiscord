const Discord = require("discord.js");

module.exports = {
    name: "setnotifchannel",
    description: "Set le salon où les utilisateurs pourrons choisir leurs roles",
    longdescription: "Set le salon où les utilisateurs pourrons choisir leurs roles de notifications (ATTENTION le salon sera clear régulièrement donc mettez un salon vide)",
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

            db.query(`UPDATE notifChannel SET notifChannelID = ${channel.id}, notifChannelName = '${channel.name}' WHERE guildID = ${message.guild.id}`);

            db.query(`CREATE TABLE notifRole_${message.guild.id} (
                roleID varchar(255) PRIMARY KEY NOT NULL,
                roleName text(255) NOT NULL,
                roleDescription text(255) NOT NULL
              ) ENGINE=InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_general_ci;`);

            console.log(`Le salon ou les utilisateur pouront désormais choisir leur roles de notification sur le serveur ${message.guild.name} est ${channel.name}`);
            return bot.msg(message, `Le salon ou les utilisateur pouront désormais choisir leur roles de notification est ${channel} !`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}