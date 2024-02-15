const Discord = require("discord.js");

module.exports = {
    name: "seturlclassement",
    description: "Set l'image du classement général",
    longdescription: "Set l'URL de l'image du classement général (il y en a une par défaut)",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "string",
        name: "image",
        description: "L'URL de l'image",
        required: true,
        autocomplete: false,
        setMinLength: 0,
        setMaxLength: 999,
    }],

    async run(bot, message, args, db) {
        try{
            let url = args.getString("image");

            url = bot.function.securiser(url);
            message.guild.name = bot.function.securiser(message.guild.name);

            if(!url.startsWith("https://"))
                return bot.eph(bot, message, `Le lien pour l'image doit être une URL internet !`);

            db.query(`UPDATE xp SET URLClassement = '${url}' WHERE guildID = ${message.guild.id}`);

            console.log(`L'image désormais utiliser pour le classement général du serveur ${message.guild.name} est ${url}`);
            return bot.msg(message, `L'image désormais utiliser pour le classement général est ${url}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}