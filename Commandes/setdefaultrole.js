const Discord = require("discord.js");

module.exports = {
    name: "setdefaultrole",
    description: "Set le role par défaut (off par défaut)",
    longdescription: "Set le role mis par défaut par le bot après la réussite du captcha (off par défaut)",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "role",
        name: "role",
        description: "Le role que le bot va mettre aux nouveaux après le captcha",
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let role = args.getRole("role");

            role.name = bot.function.securiser(role.name);
            message.guild.name = bot.function.securiser(message.guild.name);

            if((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(role) <= 0)
                return bot.eph(bot, message, "Le bot ne peut pas give ce role !");

            db.query(`UPDATE captcha SET roleID = ${role.id}, roleName = '${role.name}' WHERE guildID = ${message.guild.id}`);

            console.log(`Le role désormais mis par défaut par le bot après le captcha sur le serveur "${message.guild.name}" est "${role.name}"`);
            return bot.msg(message, `Le role désormais mis par défaut par le bot après le captcha est ${role}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}