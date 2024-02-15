const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "settempscaptcha",
    description: "Set le temps du captcha",
    longdescription: "Set le temps pour réaliser le captcha (ex: 1 heure, 15 min et 30 secondes => 1h 15m 30s)",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "string",
        name: "duree",
        description: "Le temps du captcha",
        required: true,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 8,
    }],

    async run(bot, message, args, db) {
        try{
            let duree = args.getString("duree");

            duree = bot.function.securiser(duree);
            message.guild.name = bot.function.securiser(message.guild.name);

            if(isNaN(ms(duree)))
                return bot.eph(bot, message, "Le format de la durée du mute n'est pas correcte !");

            db.query(`UPDATE captcha SET timeCaptcha = '${duree}' WHERE guildID = ${message.guild.id}`);

            console.log(`Le temps désormais disponible pour réaliser le captcha sur le serveur ${message.guild.name} est de ${duree}`);
            return bot.msg(message, `Le temps désormais disponible pour réaliser le captcha est de ${duree}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}