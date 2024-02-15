const Discord = require("discord.js");

module.exports = {
    name: "setpicksrole",
    description: "Set le role mis par défauts aux participants picks",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "role",
        name: "role",
        description: "Le role mis aux picks",
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let role = args.getRole("role");

            role.name = bot.function.securiser(role.name);
            message.guild.name = bot.function.securiser(message.guild.name);

            db.query(`UPDATE pick SET rolePicksID = ${role.id}, rolePicksName = '${role.name}' WHERE guildID = ${message.guild.id}`);

            console.log(`Le role désormais mis aux picks sur le serveur ${message.guild.name} est ${role.name}`);
            return bot.msg(message, `Le role désormais mis aux picks est ${role}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}