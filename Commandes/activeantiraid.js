const Discord = require("discord.js");

module.exports = {
    name: "activeantiraid",
    description: "Permet d'activer ou non l'anti raid",
    longdescription: "Permet d'activer ou non l'anti raid, ce dernier permet d'empécher quiconque de rejoindre le serveur discord pendant l'activation",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Modération",

    options: [{
        type: "boolean",
        name: "isantiraid",
        description: `Permet d'activer ou non l'antiraid (ne peut accepter que "true" ou "false")`,
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let isantiraid = args.getBoolean("isantiraid");

            message.guild.name = bot.function.securiser(message.guild.name);

            db.query(`UPDATE antiraid SET isantiraid = ${isantiraid} WHERE guildID = ${message.guild.id}`);

            console.log(`L'anti raid est désormais ${isantiraid ? "activé" : "désactivé"} sur le serveur "${message.guild.name}"`);            
            return bot.msg(message, `L'anti raid est désormais ${isantiraid ? "activé" : "désactivé"} sur le serveur !`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}