const Discord = require("discord.js");

module.exports = {
    name: "setpickminrole",
    description: "Set le role minimum pour pouvoir gérer un pick",
    longdescription: "Set le role minimum pour pouvoir gérer un pick",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "role",
        name: "role",
        description: "Le role nécessaire pour gérer les picks",
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let role = args.getRole("role");

            role.name = bot.function.securiser(role.name);
            message.guild.name = bot.function.securiser(message.guild.name);

            db.query(`UPDATE pick SET roleCanPickID = ${role.id}, roleCanPickName = '${role.name}' WHERE guildID = ${message.guild.id}`);

            console.log(`Le role minimum désormais nécessaire pour gérer les pics sur le serveur ${message.guild.name} est ${role.name}`);
            return bot.msg(message, `Le role minimum désormais nécessaire pour gérer les pics est ${role}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}