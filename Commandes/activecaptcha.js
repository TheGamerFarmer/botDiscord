const Discord = require("discord.js");

module.exports = {
    name: "activecaptcha",
    description: "Permet d'activer ou non le captcha",
    longdescription: "Permet d'envoyer ou non un captcha à chaque fois que quelqu'un rejoint le serveur (ne peut pas être activé si un salon n'est pas set)",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",

    options: [{
        type: "boolean",
        name: "iscaptcha",
        description: `Permet d'activer ou non le captcha (ne peut accepter que "true" ou "false")`,
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let isCaptcha = args.getBoolean("iscaptcha");

            db.query(`SELECT * FROM captcha WHERE guildID = ${message.guild.id} AND channelID != ''`, async (err, captcha) => {
                message.guild.name = bot.function.securiser(message.guild.name);

                if(!captcha[0].channelID)
                    return bot.eph(bot, message, `Il n'y a aucun salon de set pour les captchas de ce serveur !`);

                db.query(`UPDATE captcha SET isCaptcha = ${isCaptcha} WHERE guildID = ${message.guild.id}`);
                
                console.log(`Les captchas sont désormais ${isCaptcha ? "activés" : "désactivés"} sur le serveur "${message.guild.name}"`);
                return bot.msg(message, `Les captchas sont désormais ${isCaptcha ? "activés" : "désactivés"} sur le serveur !`);
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}