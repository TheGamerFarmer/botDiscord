const Discord = require("discord.js");

module.exports = {
    name: "setlongueurcaptcha",
    description: "Set la longueur du captcha",
    longdescription: "Set la longueur du captcha, 15 max",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "number",
        name: "nombre",
        description: "Nombre de caractères dans le captcha",
        required: true,
        setMinValue: 1,
        setMaxValue: 14,
    }],

    async run(bot, message, args, db) {
        try{
            let nombre = args.getNumber("nombre");

            message.guild.name = bot.function.securiser(message.guild.name);

            db.query(`UPDATE captcha SET longueurCaptcha = ${nombre} WHERE guildID = ${message.guild.id}`);

            console.log(`Le nombre de caractères désormais présent dans le captcha du serveur ${message.guild.name} est de ${nombre}`);
            return bot.msg(message, `Le nombre de caractères désormais présent dans le captcha est de ${nombre}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}